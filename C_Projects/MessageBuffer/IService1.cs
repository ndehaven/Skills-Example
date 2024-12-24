using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

// Service Location http://localhost:53062/Service1.svc 

namespace MessageBuffer
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService1" in both code and config file together.
    [ServiceContract]
    public interface IService1
    {
        // Servce Method Headers including WebGets for http responses 
        [OperationContract]
        [WebGet(UriTemplate = "/SendMsg?message={message}&recvID={recvID}&sendID={sendID}")]
        string SendMsg(string message, string recvID, string sendID);
        
        [OperationContract]
        [WebGet(UriTemplate = "/ReceiveMsg?recvID={recvID}&purge={purge}")]
        string ReceiveMsg(string recvID, bool purge);
        
    }
}
