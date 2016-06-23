using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Vinylizer.Models
{
    public class Converter
    {
        public static void Merge(string mergeString, string fileName, int usedFilters)
        {
            string output = string.Format("Converted{0}/", fileName);
            string command = string.Format("{0} -filter_complex amix=inputs={1}:duration=first:dropout_transition=2 {2}", mergeString, usedFilters, fileName);
            var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
            ffMpeg.Invoke(command);
        }

        public static string ChangeVolume(int volumePart, string filterName)
        {
            Random rnd = new Random();
            string output = string.Format("filter{0}.mp3", rnd.Next(1000000000));
            string command = string.Format(@"-i {0} -af ""volume={1}"" {2}", filterName, volumePart, output).Replace("\"", string.Empty);
            var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
            ffMpeg.Invoke(command);

            return output;
        }

        public static string Loop(int filterId, TimeSpan duration)
        {
            Random rnd = new Random();
            string file = string.Format("loop{0}.txt", filterId.ToString());
            string output = string.Format("filter{0}.mp3", rnd.Next(1000000000));
            string command = string.Format("- t {0} - f concat - i {1} - c copy - t {0} {2}", duration.TotalSeconds.ToString(), file, output);
            var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
            ffMpeg.Invoke(command);

            return output;
        }
    }
}