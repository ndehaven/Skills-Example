using System;
using System.ServiceModel;
using System.ServiceModel.Description; 


namespace ServiceConsole
{
    // Function Method Names
    [ServiceContract]
    public interface consoleInterface
    {
        [OperationContract]
        string NumberChecker(int val1, int val2);

        [OperationContract]
        int SecretNumber(int x, int y);
    }
    // Function Method Definitions 
    public class consoleService : consoleInterface {

        public int SecretNumber(int lower, int upper)
        {
            DateTime time = DateTime.Now; //Takes exact time 
            int numSeed = (int)time.Ticks; // Using exact time, takes the amount 
            Random random = new Random(numSeed);
            int num = random.Next(lower, upper);
            return num;

        }

        public string NumberChecker(int inputNum, int actualNum)
        {
            if (inputNum == actualNum)
                return "Correct!";
            else
                if (inputNum > actualNum)
                return "Too big";
            else
                return "Too small!";
        }

    }

    internal class Program
    {
        static void Main(string[] args)
        {
            // Start with creating an URL instance to give to the service using Uri Library class 
            Uri baseAddy = new Uri("http://localhost:7999/Service"); // port number is random, not given 
            // Then create a selfHost to host this service 
            ServiceHost selfHost = new ServiceHost(typeof(consoleService), baseAddy);
            //Now that we have a host, we need an endpoint for it to bind with 
            //Endpoint = (service-contract, bind, behavior/address) 
            selfHost.AddServiceEndpoint(typeof(consoleInterface), new WSHttpBinding(), "consoleService");

            // We need to make this public, in order to do so we need to add metadata and add it to our host 
            System.ServiceModel.Description.ServiceMetadataBehavior smb = new System.ServiceModel.Description.ServiceMetadataBehavior();
            smb.HttpGetEnabled = true; // Turn HTTP on for public access and calls 
            selfHost.Description.Behaviors.Add(smb);
            // Open. Close. 
            selfHost.Open();
            Console.WriteLine("Service is active and waiting for a response");
            Console.WriteLine("Click <ENTER> twice to close the service\n");
            Console.ReadLine();
            selfHost.Close(); 
        }
    }
}
