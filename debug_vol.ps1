Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class WinVol {
    [DllImport("ole32.dll")] public static extern int CoCreateInstance(ref Guid clsid, IntPtr pUnkOuter, int clsContext, ref Guid iid, out IntPtr ppv);

    public static float Get() {
        IntPtr enumerator = IntPtr.Zero;
        IntPtr device = IntPtr.Zero;
        IntPtr volume = IntPtr.Zero;
        try {
            Guid CLSID_MMDeviceEnumerator = new Guid("BCDE0395-E52F-467C-8E3D-C4579291692E");
            Guid IID_IMMDeviceEnumerator = new Guid("A95664D2-9614-4F35-A746-DE8DB63617E6");
            CoCreateInstance(ref CLSID_MMDeviceEnumerator, IntPtr.Zero, 1, ref IID_IMMDeviceEnumerator, out enumerator);

            // IMMDeviceEnumerator::GetDefaultAudioEndpoint is 5th method (index 4)
            // HRESULT GetDefaultAudioEndpoint(EDataFlow dataFlow, ERole role, IMMDevice **ppEndpoint);
            IntPtr getDeviceAddr = GetVTableMethod(enumerator, 4);
            var getDevice = (GetDefaultAudioEndpointDelegate)Marshal.GetDelegateForFunctionPointer(getDeviceAddr, typeof(GetDefaultAudioEndpointDelegate));
            getDevice(enumerator, 0, 0, out device);

            // IMMDevice::Activate is 4th method (index 3)
            // HRESULT Activate(REFIID iid, DWORD dwClsCtx, PROPVARIANT *pActivationParams, void **ppInterface);
            IntPtr activateAddr = GetVTableMethod(device, 3);
            var activate = (ActivateDelegate)Marshal.GetDelegateForFunctionPointer(activateAddr, typeof(ActivateDelegate));
            Guid IID_IAudioEndpointVolume = new Guid("5CDF2C82-841E-4546-9722-0CF74078229A");
            activate(device, ref IID_IAudioEndpointVolume, 1, IntPtr.Zero, out volume);

            // IAudioEndpointVolume::GetMasterVolumeLevelScalar is 10th method (index 9)
            IntPtr getVolAddr = GetVTableMethod(volume, 9);
            var getVol = (GetMasterVolumeLevelScalarDelegate)Marshal.GetDelegateForFunctionPointer(getVolAddr, typeof(GetMasterVolumeLevelScalarDelegate));
            float level;
            getVol(volume, out level);
            return level;
        } catch { return -1; }
        finally {
            if (enumerator != IntPtr.Zero) Marshal.Release(enumerator);
            if (device != IntPtr.Zero) Marshal.Release(device);
            if (volume != IntPtr.Zero) Marshal.Release(volume);
        }
    }

    public static void Set(float level) {
        IntPtr enumerator = IntPtr.Zero;
        IntPtr device = IntPtr.Zero;
        IntPtr volume = IntPtr.Zero;
        try {
            Guid CLSID_MMDeviceEnumerator = new Guid("BCDE0395-E52F-467C-8E3D-C4579291692E");
            Guid IID_IMMDeviceEnumerator = new Guid("A95664D2-9614-4F35-A746-DE8DB63617E6");
            CoCreateInstance(ref CLSID_MMDeviceEnumerator, IntPtr.Zero, 1, ref IID_IMMDeviceEnumerator, out enumerator);

            IntPtr getDeviceAddr = GetVTableMethod(enumerator, 4);
            var getDevice = (GetDefaultAudioEndpointDelegate)Marshal.GetDelegateForFunctionPointer(getDeviceAddr, typeof(GetDefaultAudioEndpointDelegate));
            getDevice(enumerator, 0, 0, out device);

            IntPtr activateAddr = GetVTableMethod(device, 3);
            var activate = (ActivateDelegate)Marshal.GetDelegateForFunctionPointer(activateAddr, typeof(ActivateDelegate));
            Guid IID_IAudioEndpointVolume = new Guid("5CDF2C82-841E-4546-9722-0CF74078229A");
            activate(device, ref IID_IAudioEndpointVolume, 1, IntPtr.Zero, out volume);

            // IAudioEndpointVolume::SetMasterVolumeLevelScalar is 8th method (index 7)
            IntPtr setVolAddr = GetVTableMethod(volume, 7);
            var setVol = (SetMasterVolumeLevelScalarDelegate)Marshal.GetDelegateForFunctionPointer(setVolAddr, typeof(SetMasterVolumeLevelScalarDelegate));
            Guid g = Guid.Empty;
            setVol(volume, level, ref g);
        } catch { }
        finally {
            if (enumerator != IntPtr.Zero) Marshal.Release(enumerator);
            if (device != IntPtr.Zero) Marshal.Release(device);
            if (volume != IntPtr.Zero) Marshal.Release(volume);
        }
    }

    private static IntPtr GetVTableMethod(IntPtr obj, int index) {
        IntPtr vtable = Marshal.ReadIntPtr(obj);
        return Marshal.ReadIntPtr(vtable, index * IntPtr.Size);
    }

    [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int GetDefaultAudioEndpointDelegate(IntPtr self, int dataFlow, int role, out IntPtr ppEndpoint);
    [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int ActivateDelegate(IntPtr self, [In] ref Guid iid, int dwClsCtx, IntPtr pActivationParams, out IntPtr ppInterface);
    [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int GetMasterVolumeLevelScalarDelegate(IntPtr self, out float pfLevel);
    [UnmanagedFunctionPointer(CallingConvention.StdCall)] delegate int SetMasterVolumeLevelScalarDelegate(IntPtr self, float fLevel, [In] ref Guid pguidEventContext);
}
"@ -Language CSharp

[WinVol]::Set(0.25)
Start-Sleep -Milliseconds 200
Write-Output "Volume after set: $([WinVol]::Get())"
