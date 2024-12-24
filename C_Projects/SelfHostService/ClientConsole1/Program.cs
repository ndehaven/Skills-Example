using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// This client console is where the proxy is created, use this command line to create it: 
// svcutil.exe /language:cs /out:generatedProxy.cs /config:App.config http://localhost:7999/Service
// Two new files will be created: app.config and generatedProxy 

namespace ClientConsole1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // Create the proxy then call the functions and give them test cases 
            consoleInterfaceClient myProxy = new consoleInterfaceClient(); 
            string userGuess;
            int low = 0;
            string lowString;
            int high = 0;
            string highString;
            int attemptCounter = 0; 
            // Start of the console
            Console.WriteLine("Welcome to the Guessing Game!\n ");
            do
            {
                Console.WriteLine("Before we begin please select a lower limit and an upper limit. \n");
                Console.WriteLine("Make sure your lower limit is less than the upper limit and make sure to use real values !\n");
                Console.WriteLine("Lower Limit: ");
                lowString = Console.ReadLine();
                // Check for valid inputs using TryParse
                if (int.TryParse(lowString, out low))
                {
                    Console.WriteLine("Upper Limit: ");
                    highString = Console.ReadLine();
                    if(int.TryParse(highString, out high))
                    {
                        Console.WriteLine("Checking values...\n"); 
                    }
                    else
                    {
                        Console.WriteLine("It appears the value you've entered is invalid!");
                        // Reset the values to trigger the loop if values are invalid 
                        low = 1;
                        high = 0; 
                    }
                }
                else
                {
                    Console.WriteLine("It appears the value you've entered is invalid!");
                    low = 1;
                    high = 0;
                }
            } while(low > high); 
            // Loop that will prevent the user from entering invalid arguements 

            Console.WriteLine("Limit values have been registered!\n");
            int secretValue = myProxy.SecretNumber(low, high); // Use the proxy to call our number generator function
            Console.WriteLine("A random number has been generated between your given values\n"); 
            do{ 
                // Loop will make sure no invalid arguements are input by the user 
                Console.WriteLine("Enter a non-empty guess between these values(Make sure the value is a real number)\n");
                userGuess = Console.ReadLine();
                attemptCounter++;
            }
            while (string.IsNullOrWhiteSpace(userGuess) || (!int.TryParse(userGuess, out int guesss)));
            // Previous loop will check for null as well as invalid guesses
            if (int.TryParse(userGuess, out int guess))
            {
                // Check if the value is valid, then send it to the NumberChecker using the proxy 
                Console.WriteLine("Plugging into Number Checker...\n");
                Console.WriteLine("Checking value given..\n");
                string output = myProxy.NumberChecker(guess, secretValue);
                Console.WriteLine("The number you entered was ");
                Console.WriteLine(output);
                if (guess.Equals(secretValue))
                {
                    // Correct guess detected 
                    Console.WriteLine("Congratulations, you guessed correctly on your first try!\n");
                    Console.WriteLine("Press <ENTER> to close the service");
                    myProxy.Close();
                    Console.ReadLine();
                }
                else
                {
                    // Cases for wrong guesses 
                    while (!guess.Equals(secretValue))
                    {
                        Console.WriteLine("Try again\n");
                        do
                        {
                            userGuess = Console.ReadLine();
                            attemptCounter++;
                        }
                        while (string.IsNullOrWhiteSpace(userGuess) || (!int.TryParse(userGuess, out int guessss)));

                        int.TryParse(userGuess, out int guesssss);
                        guess = guesssss;
                        string outputs = myProxy.NumberChecker(guess, secretValue);
                        Console.WriteLine(outputs);
                        Console.WriteLine("\n");
                    }
                    Console.WriteLine("Congratulations, you guessed correctly!\n");
                    Console.WriteLine("It only took you " + attemptCounter + " attempts");
                    Console.WriteLine("Press <ENTER> to close the service\n");
                    myProxy.Close(); // Close the proxy and the channel
                    Console.ReadLine();
                }
            }
        }
    }
}
