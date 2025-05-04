using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing.Printing;
using Patagames.Pdf.Net;
using Patagames.Pdf.Net.Controls.WinForms;

namespace PrintJobHandler
{
    internal class Program
    {
        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Please provide the path to the PDF file as an argument.");
                return;
            }

            string pdfFilePath = args[0];
            string printMode = args[1];

            if (!File.Exists(pdfFilePath))
            {
                Console.WriteLine($"File not found: {pdfFilePath}");
                return;
            }

            PrintPdf(pdfFilePath, printMode);
        }

        private static void PrintPdf(string pdfFilePath, string mode)
        {
            switch (mode)
            {
                case "default_printer":
                    PrintPdf_DefaultPrinter(pdfFilePath);
                    break;

                case "default_print_dialog":
                    PrintPdf_DefaultPrintDialog(pdfFilePath);
                    break;

                default:
                    Console.WriteLine("Invalid Print Mode");
                    break;
            }
        }

        private static void PrintPdf_DefaultPrinter(string pdfFilePath)
        {
            var doc = PdfDocument.Load(pdfFilePath);
            var printDoc = new PdfPrintDocument(doc);
            printDoc.Print();
        }

        private static void PrintPdf_DefaultPrintDialog(string pdfFilePath)
        {
            var doc = PdfDocument.Load(pdfFilePath);
            var printDoc = new PdfPrintDocument(doc);
            PrintController printController = new StandardPrintController();
            printDoc.PrintController = printController;
            printDoc.Print();
        }
    }
}
