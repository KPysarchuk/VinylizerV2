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
            byte[] fileBytes = System.IO.File.ReadAllBytes(HttpContext.Server.MapPath((string.Format("~/App_Data/{0}", fileName))));
            MemoryStream ms = new MemoryStream(fileBytes);

            return File(ms, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        public ActionResult GetFilterForPlay(int filterId)
        {
            string fileName = filterId.ToString() + ".mp3";
            byte[] fileBytes = System.IO.File.ReadAllBytes(HttpContext.Server.MapPath(("~/App_Data/" + fileName)));
            MemoryStream ms = new MemoryStream(fileBytes);

            return File(ms, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        public static void Combine(string[] mp3Files, string mp3OuputFile)
        {
            using (var w = new BinaryWriter(System.IO.File.Create(mp3OuputFile)))
            {
                new List<string>(mp3Files).ForEach(f => w.Write(System.IO.File.ReadAllBytes(f)));
            }
        }

        [HttpPost]
        public ActionResult GetAudioFileForDownload(string fileName, FilterModel[] filters)
        {
            int usedFilters = 1;
            Mp3FileReader reader = new Mp3FileReader(HttpContext.Server.MapPath(("~/App_Data/" + fileName)));
            TimeSpan duration = reader.TotalTime;
            string wayToAppData = HttpContext.Server.MapPath((string.Format("~/App_Data/"))).Replace("\\", "/"); 
            string mergeString = "-i " + wayToAppData + fileName;

            foreach (var filter in filters)
            {
                if (filter.Volume != 0)
                {
                    string finishedName = Converter.ChangeVolume(filter.Volume, filter.Id, wayToAppData);
                    string[] files = new string[200];
                    for (int i = 0; i < files.Length; i++)
                    {
                        files[i] = wayToAppData + "Newfilter" + filter.Id.ToString()+ "Volume" + ".mp3";
                    }
                    var output = wayToAppData + "Newfilter" + filter.Id.ToString() + ".mp3";
                    Combine(files, output);
                    mergeString = mergeString + " -i " + finishedName;
                    usedFilters++;
                }
            }
            if (filters.Where(f => f.Volume >= 0).Any())
            {
                Converter.Merge(mergeString, fileName, usedFilters, wayToAppData);
            }
                string mixName = string.Format("Converted{0}", fileName);
                byte[] fileBytes = System.IO.File.ReadAllBytes(HttpContext.Server.MapPath((string.Format("~/App_Data/{0}", mixName))));
         
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, mixName);
        }
    }
}