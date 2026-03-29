param([string]$Action, [int]$Value)
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class WinVol {
    [DllImport("ole32.dll")] public static extern int CoCreateInstance(ref Guid clsid, IntPtr pUnkOuter, int clsContext, ref Guid iid, out IntPtr ppv);
    [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int GetDefaultAudioEndpointDelegate(IntPtr self, int dataFlow, int role, out IntPtr ppEndpoint);
    [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int ActivateDelegate(IntPtr self, [In] ref Guid iid, int dwClsCtx, IntPtr pActivationParams, out IntPtr ppInterface);
    [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int GetMasterVolumeLevelScalarDelegate(IntPtr self, out float pfLevel);
    [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int SetMasterVolumeLevelScalarDelegate(IntPtr self, float fLevel, [In] ref Guid pguidEventContext);
    private static IntPtr GetVTableMethod(IntPtr obj, int index) {
        IntPtr vtable = Marshal.ReadIntPtr(obj);
        return Marshal.ReadIntPtr(vtable, index * IntPtr.Size);
    }
    public static int Get() {
        IntPtr enumerator = IntPtr.Zero; IntPtr device = IntPtr.Zero; IntPtr volume = IntPtr.Zero;
        try {
            Guid CLSID_MMDeviceEnumerator = new Guid("BCDE0395-E52F-467C-8E3D-C4579291692E");
            Guid IID_IMMDeviceEnumerator = new Guid("A95664D2-9614-4F35-A746-DE8DB63617E6");
            CoCreateInstance(ref CLSID_MMDeviceEnumerator, IntPtr.Zero, 1, ref IID_IMMDeviceEnumerator, out enumerator);
            IntPtr getDeviceAddr = GetVTableMethod(enumerator, 4);
            var getDevice = (GetDefaultAudioEndpointDelegate)Marshal.GetDelegateForFunctionPointer(getDeviceAddr, typeof(GetDefaultAudioEndpointDelegate));
            
            // Try Multimedia (1) then Console (0)
            if (getDevice(enumerator, 0, 1, out device) != 0) {
               getDevice(enumerator, 0, 0, out device);
            }

            if (device != IntPtr.Zero) {
                var activate = (ActivateDelegate)Marshal.GetDelegateForFunctionPointer(GetVTableMethod(device, 3), typeof(ActivateDelegate));
                Guid IID_IAudioEndpointVolume = new Guid("5CDF2C82-841E-4546-9722-0CF74078229A");
                if (activate(device, ref IID_IAudioEndpointVolume, 1, IntPtr.Zero, out volume) == 0 && volume != IntPtr.Zero) {
                    var getVol = (GetMasterVolumeLevelScalarDelegate)Marshal.GetDelegateForFunctionPointer(GetVTableMethod(volume, 9), typeof(GetMasterVolumeLevelScalarDelegate));
                    float level; getVol(volume, out level);
                    return (int)Math.Round(level * 100);
                }
            }
            return -1;
        } catch { return -1; }
        finally {
            if (volume != IntPtr.Zero) Marshal.Release(volume);
            if (device != IntPtr.Zero) Marshal.Release(device);
            if (enumerator != IntPtr.Zero) Marshal.Release(enumerator);
        }
    }

    public static void Set(int n) {
        IntPtr enumerator = IntPtr.Zero; IntPtr device = IntPtr.Zero; IntPtr volume = IntPtr.Zero;
        try {
            float f = (float)n / 100.0f;
            Guid CLSID_MMDeviceEnumerator = new Guid("BCDE0395-E52F-467C-8E3D-C4579291692E");
            Guid IID_IMMDeviceEnumerator = new Guid("A95664D2-9614-4F35-A746-DE8DB63617E6");
            CoCreateInstance(ref CLSID_MMDeviceEnumerator, IntPtr.Zero, 1, ref IID_IMMDeviceEnumerator, out enumerator);
            IntPtr getDeviceAddr = GetVTableMethod(enumerator, 4);
            var getDevice = (GetDefaultAudioEndpointDelegate)Marshal.GetDelegateForFunctionPointer(getDeviceAddr, typeof(GetDefaultAudioEndpointDelegate));
            
            // Set for BOTH Multimedia and Console to be safe
            int[] roles = { 1, 0, 2 };
            foreach(int r in roles) {
                IntPtr dev = IntPtr.Zero;
                if (getDevice(enumerator, 0, r, out dev) == 0 && dev != IntPtr.Zero) {
                    IntPtr vol = IntPtr.Zero;
                    var activate = (ActivateDelegate)Marshal.GetDelegateForFunctionPointer(GetVTableMethod(dev, 3), typeof(ActivateDelegate));
                    Guid IID_IAudioEndpointVolume = new Guid("5CDF2C82-841E-4546-9722-0CF74078229A");
                    if (activate(dev, ref IID_IAudioEndpointVolume, 1, IntPtr.Zero, out vol) == 0 && vol != IntPtr.Zero) {
                        var setVol = (SetMasterVolumeLevelScalarDelegate)Marshal.GetDelegateForFunctionPointer(GetVTableMethod(vol, 7), typeof(SetMasterVolumeLevelScalarDelegate));
                        Guid g = Guid.Empty; setVol(vol, f, ref g);
                        Marshal.Release(vol);
                    }
                    Marshal.Release(dev);
                }
            }
        } catch { }
        finally {
            if (enumerator != IntPtr.Zero) Marshal.Release(enumerator);
        }
    }
}
"@ -Language CSharp

if ($Action -eq "get") {
    Write-Output [WinVol]::Get()
} elseif ($Action -eq "set") {
    [WinVol]::Set($Value)
}
