using NAudio.Wave;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Vinylizer.Models;

namespace Vinylizer.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetAudioFileForPlay(string fileName)
        {
            byte[] fileBytes = System.IO.File.ReadAllBytes(string.Format("~App_Data/{0}", fileName));
            MemoryStream ms = new MemoryStream(fileBytes);

            return File(ms, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        public ActionResult GetFilterForPlay(int filterId)
        {
            string fileName = filterId.ToString() + ".mp3";
            byte[] fileBytes = System.IO.File.ReadAllBytes("~App_Data/" + fileName);
            MemoryStream ms = new MemoryStream(fileBytes);

            return File(ms, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        public ActionResult GetAudioFileForDownload(string fileName, FilterModel[] filters)
        {
            int usedFilters = 1;
            Mp3FileReader reader = new Mp3FileReader("~App_Data/" + fileName);
            TimeSpan duration = reader.TotalTime;
            string mergeString = "-i " + fileName;

            foreach (var filter in filters)
            {
                if (filter.Volume != 0)
                {
                    string filterName = Converter.Loop(filter.Id, duration);
                    string finishedName = Converter.ChangeVolume(filter.Volume, fileName);
                    mergeString = mergeString + " -i " + finishedName;
                    usedFilters++;
                }
            }

            Converter.Merge(mergeString, fileName, usedFilters);

            string mixName = string.Format("Converted{0}", fileName);
            byte[] fileBytes = System.IO.File.ReadAllBytes(string.Format("~/App_Data/{0}", mixName));

            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, mixName);
        }
    }
}