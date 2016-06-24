using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Vinylizer.Models
{
    public class Converter
    {
        public static void Merge(string mergeString, string fileName, int usedFilters, string wayToAppData)
        {
            string output = string.Format("{1}Converted{0}", fileName, wayToAppData);
            string command = string.Format("-y {0} -filter_complex amix=inputs={1}:duration=first:dropout_transition=2 {2}", mergeString, usedFilters, output);
            var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
            ffMpeg.Invoke(command);
        }

        public static string ChangeVolume(int volumePart, int filterId, string wayToAppData)
        {
            string filterName = filterId.ToString();
            Random rnd = new Random();
            string output = string.Format("{1}Newfilter{0}Volume.mp3", filterName, wayToAppData);
            string command = string.Format(@"-y -i {3}{0}.mp3 -af ""volume=0.{1}"" {2}", filterName, volumePart, output, wayToAppData).Replace("\"", string.Empty);
            var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
            ffMpeg.Invoke(command);

            return output;
        }

        public static string Loop(int filterId, TimeSpan duration)
        {
            Random rnd = new Random();
            string file = string.Format("loop{0}.txt", filterId.ToString());
            string output = string.Format("Newfilter{0}.mp3", filterId);
            string command = string.Format("-y -t {0} -f concat -i {1} -c copy -t {0} {2}", duration.TotalSeconds.ToString(), file, output);
            var ffMpeg = new NReco.VideoConverter.FFMpegConverter();
            ffMpeg.Invoke(command);

            return output;
        }
    }
}