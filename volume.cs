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

    public static void Main(string[] args) {
        if (args.Length < 1) return;
        string action = args[0].ToLower();

        IntPtr enumerator = IntPtr.Zero;
        try {
            Guid CLSID_MMDeviceEnumerator = new Guid("BCDE0395-E52F-467C-8E3D-C4579291692E");
            Guid IID_IMMDeviceEnumerator = new Guid("A95664D2-9614-4F35-A746-DE8DB63617E6");
            CoCreateInstance(ref CLSID_MMDeviceEnumerator, IntPtr.Zero, 1, ref IID_IMMDeviceEnumerator, out enumerator);
            IntPtr getDeviceAddr = GetVTableMethod(enumerator, 4);
            var getDevice = (GetDefaultAudioEndpointDelegate)Marshal.GetDelegateForFunctionPointer(getDeviceAddr, typeof(GetDefaultAudioEndpointDelegate));

            if (action == "get") {
                // Try roles 1 then 0
                IntPtr device = IntPtr.Zero;
                if (getDevice(enumerator, 0, 1, out device) != 0) {
                    getDevice(enumerator, 0, 0, out device);
                }
                if (device != IntPtr.Zero) {
                    IntPtr volume = IntPtr.Zero;
                    var activate = (ActivateDelegate)Marshal.GetDelegateForFunctionPointer(GetVTableMethod(device, 3), typeof(ActivateDelegate));
                    Guid IID_IAudioEndpointVolume = new Guid("5CDF2C82-841E-4546-9722-0CF74078229A");
                    if (activate(device, ref IID_IAudioEndpointVolume, 1, IntPtr.Zero, out volume) == 0 && volume != IntPtr.Zero) {
                        var getVol = (GetMasterVolumeLevelScalarDelegate)Marshal.GetDelegateForFunctionPointer(GetVTableMethod(volume, 9), typeof(GetMasterVolumeLevelScalarDelegate));
                        float level; getVol(volume, out level);
                        Console.WriteLine((int)Math.Round(level * 100));
                        Marshal.Release(volume);
                    }
                    Marshal.Release(device);
                }
            } else if (action == "set" && args.Length >= 2) {
                int n;
                if (int.TryParse(args[1], out n)) {
                    float f = (float)n / 100.0f;
                    int[] roles = { 1, 0, 2 };
                    foreach(int r in roles) {
                        IntPtr device = IntPtr.Zero;
                        if (getDevice(enumerator, 0, r, out device) == 0 && device != IntPtr.Zero) {
                            IntPtr volume = IntPtr.Zero;
                            var activate = (ActivateDelegate)Marshal.GetDelegateForFunctionPointer(GetVTableMethod(device, 3), typeof(ActivateDelegate));
                            Guid IID_IAudioEndpointVolume = new Guid("5CDF2C82-841E-4546-9722-0CF74078229A");
                            if (activate(device, ref IID_IAudioEndpointVolume, 1, IntPtr.Zero, out volume) == 0 && volume != IntPtr.Zero) {
                                var setVol = (SetMasterVolumeLevelScalarDelegate)Marshal.GetDelegateForFunctionPointer(GetVTableMethod(volume, 7), typeof(SetMasterVolumeLevelScalarDelegate));
                                Guid g = Guid.Empty; setVol(volume, f, ref g);
                                Marshal.Release(volume);
                            }
                            Marshal.Release(device);
                        }
                    }
                }
            }
        } catch {}
        finally { if (enumerator != IntPtr.Zero) Marshal.Release(enumerator); }
    }
}
