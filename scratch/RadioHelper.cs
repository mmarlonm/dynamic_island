
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Windows.Devices.Radios;

public class RadioManager {
    public static async Task<string> GetStatus() {
        try {
            var radios = await Radio.GetRadiosAsync();
            string output = "";
            foreach (var r in radios) {
                output += r.Kind + ":" + r.State + "|";
            }
            return output;
        } catch (Exception e) {
            return "ERROR:" + e.Message;
        }
    }
}
