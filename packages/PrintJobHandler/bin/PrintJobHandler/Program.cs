using System;
using System.IO;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing.Printing;
using PdfiumViewer;

namespace PrintJobHandler
{
    internal class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                string input = Console.ReadLine();
                ProcessInput(input);
            }
        }

        private static void ProcessInput(string input)
        {
            if(input == null)
            {
                Console.WriteLine("invalid input");
                return;
            }

            if(input.Contains(','))
            {
                string[] tokens = input.Split(',');

                if(!File.Exists(tokens[0].Trim()))
                {
                    Console.WriteLine("invalid file path");
                    return;
                }
                PrintPdf(tokens[0].Trim(), tokens[1].Trim());
                return;
            }

            if (input.Equals("exit"))
                System.Environment.Exit(0);
        }

        private static void PrintPdf(string pdfFilePath, string mode)
        {
            switch (mode)
            {
                case "use_default_printer":
                    PrintPdf_DefaultPrinter(pdfFilePath);
                    break;

                case "use_default_print_dialog":
                    PrintPdf_DefaultPrintDialog(pdfFilePath);
                    break;

                case "use_default_local_pdf_viewer":
                    PrintPdf_DefaultPdfViewer(pdfFilePath);
                    break;

                default:
                    Console.WriteLine("Invalid Print Mode");
                    break;
            }
        }

        private static void PrintPdf_DefaultPdfViewer(string pdfFilePath)
        {
            ProcessStartInfo psi = new ProcessStartInfo()
            {
                FileName = pdfFilePath,
                Verb = "print",
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden
            };

            Process.Start(psi);
            Console.WriteLine("printer launched");
        }

        private static void PrintPdf_DefaultPrinter(string pdfFilePath)
        {
            var pdf = PdfDocument.Load(pdfFilePath);
            var printDoc = pdf.CreatePrintDocument();
            printDoc.Print();
            Console.WriteLine("printer launched");
        }

        private static void PrintPdf_DefaultPrintDialog(string pdfFilePath)
        {
            var pdf = PdfDocument.Load(pdfFilePath);
            var printDoc = pdf.CreatePrintDocument();
            PrintController printController = new StandardPrintController();
            printDoc.PrintController = printController;
            printDoc.Print();
            Console.WriteLine("printer launched");
        }
    }
}
