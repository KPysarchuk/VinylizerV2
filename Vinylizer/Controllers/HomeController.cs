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
                w.Close(); 
            }
        }

        [HttpGet]
        public ActionResult GetAudioFileForDownload(string fileName, int Volume1, int Volume2, int Volume3, int Volume4, int Volume5, int Volume6)
        {
            List<FilterModel> filters = new List<FilterModel>();
            filters.Add(new FilterModel { Id = 1, Volume = Volume1 });
            filters.Add(new FilterModel { Id = 2, Volume = Volume2 });
            filters.Add(new FilterModel { Id = 3, Volume = Volume3 });
            filters.Add(new FilterModel { Id = 4, Volume = Volume4 });
            filters.Add(new FilterModel { Id = 5, Volume = Volume5 });
            filters.Add(new FilterModel { Id = 6, Volume = Volume6 });
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
                    mergeString = mergeString + " -i " + output;
                    usedFilters++;
                }
            }
            if (filters.Where(f => f.Volume >= 0).Any())
            {
                Converter.Merge(mergeString, fileName, usedFilters, wayToAppData);
            }
            string Ok = "Done";
            string mixName = string.Format("Converted{0}", fileName);
            byte[] fileBytes = System.IO.File.ReadAllBytes(HttpContext.Server.MapPath((string.Format("~/App_Data/{0}", mixName))));
            MemoryStream ms = new MemoryStream(fileBytes);
            FileStreamResult fsr = new FileStreamResult(ms, "audio/mpeg");
            fsr.FileDownloadName = mixName;

            return fsr;
        }
    }
}