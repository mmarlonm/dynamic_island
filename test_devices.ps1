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

    public static string CheckDevices() {
        IntPtr enumerator = IntPtr.Zero;
        try {
            Guid CLSID_MMDeviceEnumerator = new Guid("BCDE0395-E52F-467C-8E3D-C4579291692E");
            Guid IID_IMMDeviceEnumerator = new Guid("A95664D2-9614-4F35-A746-DE8DB63617E6");
            CoCreateInstance(ref CLSID_MMDeviceEnumerator, IntPtr.Zero, 1, ref IID_IMMDeviceEnumerator, out enumerator);
            IntPtr getDeviceAddr = GetVTableMethod(enumerator, 4);
            var getDevice = (GetDefaultAudioEndpointDelegate)Marshal.GetDelegateForFunctionPointer(getDeviceAddr, typeof(GetDefaultAudioEndpointDelegate));

            string log = "";
            for(int r = 0; r <= 2; r++) {
                IntPtr device = IntPtr.Zero;
                int hr = getDevice(enumerator, 0, r, out device);
                if (hr == 0 && device != IntPtr.Zero) {
                    log += "Role " + r + ": Valid endpoint found.\n";
                    Marshal.Release(device);
                } else {
                    log += "Role " + r + ": Error " + hr + "\n";
                }
            }
            return log;
        } catch (Exception ex) { return ex.Message; }
        finally { if (enumerator != IntPtr.Zero) Marshal.Release(enumerator); }
    }
}
"@ -Language CSharp

[WinVol]::CheckDevices()
