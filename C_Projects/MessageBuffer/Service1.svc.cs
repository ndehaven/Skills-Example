using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Xml.Linq;
using System.ServiceModel.Activation;
using System.Web.Http.Cors;

// Service Location http://localhost:53062/Service1.svc 

namespace MessageBuffer
{   // Needed to add this due to CORS error problems happening on the second service call 
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class Service1 : IService1
    {
        public string SendMsg(string message, string recvID, string sendID)
        {
            // Find xml path 
            string xmlPath = @"C:\Users\16024\source\repos\MessageBuffer\MessageBuffer\XMLFile1.xml";
            XDocument xmlFile; 
            if(!File.Exists(xmlPath)){
                xmlFile = new XDocument(new XElement("Messages"));
            }
            else{
                // Load xml file containing database 
                xmlFile = XDocument.Load(xmlPath);
            }
            // Set elements up to be added and saved to xml file using user input 
            string time = DateTime.Now.ToString("HH:mm:ss");
            XElement newMessage = new XElement("message",
                        new XElement("messageString", message),
                        new XElement("recvID", recvID), // Assuming sender ID is hardcoded for now
                        new XElement("senderID", sendID), // Assuming receiver ID is hardcoded for now
                        new XElement("timestamp", time));
            xmlFile.Root.Add(newMessage);
            xmlFile.Save(xmlPath); 
            return $"Message '{message}' sent from {sendID} to {recvID}";
        }

        // Second RESTful service that will receive the message from the xml database that was buffered
        public string ReceiveMsg(string recvID, bool purge)
        {
            // Find file of xml database 
            string filePath = @"C:\Users\16024\source\repos\MessageBuffer\MessageBuffer\XMLFile1.xml";
            XDocument doc = XDocument.Load(filePath);

            // Query for message elements with the specified receiver ID
            IEnumerable<string> messages = doc.Root.Elements("message")
                                  .Where(m => m.Element("recvID").Value == recvID)
                                  .Select(m => m.Element("messageString").Value);

            string xmlResponse = "<ArrayOfstring>";
            // STart point for messages 
            foreach (string message in messages)
            {
                xmlResponse += $"<string>{message}</string>";
            }
            // End point of messages 
            xmlResponse += "</ArrayOfstring>";
            // Check purge value if needed to delete the previous messages 
            if (purge)
            {
                doc.Root.Elements("message")
                        .Where(m => m.Element("recvID").Value == recvID)
                        .Remove();
                doc.Save(filePath);
            }

            return xmlResponse;
        }

    }
}
