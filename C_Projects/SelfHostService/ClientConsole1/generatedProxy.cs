﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------



[System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
[System.ServiceModel.ServiceContractAttribute(ConfigurationName="consoleInterface")]
public interface consoleInterface
{
    
    [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/consoleInterface/NumberChecker", ReplyAction="http://tempuri.org/consoleInterface/NumberCheckerResponse")]
    string NumberChecker(int val1, int val2);
    
    [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/consoleInterface/NumberChecker", ReplyAction="http://tempuri.org/consoleInterface/NumberCheckerResponse")]
    System.Threading.Tasks.Task<string> NumberCheckerAsync(int val1, int val2);
    
    [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/consoleInterface/SecretNumber", ReplyAction="http://tempuri.org/consoleInterface/SecretNumberResponse")]
    int SecretNumber(int x, int y);
    
    [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/consoleInterface/SecretNumber", ReplyAction="http://tempuri.org/consoleInterface/SecretNumberResponse")]
    System.Threading.Tasks.Task<int> SecretNumberAsync(int x, int y);
}

[System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
public interface consoleInterfaceChannel : consoleInterface, System.ServiceModel.IClientChannel
{
}

[System.Diagnostics.DebuggerStepThroughAttribute()]
[System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
public partial class consoleInterfaceClient : System.ServiceModel.ClientBase<consoleInterface>, consoleInterface
{
    
    public consoleInterfaceClient()
    {
    }
    
    public consoleInterfaceClient(string endpointConfigurationName) : 
            base(endpointConfigurationName)
    {
    }
    
    public consoleInterfaceClient(string endpointConfigurationName, string remoteAddress) : 
            base(endpointConfigurationName, remoteAddress)
    {
    }
    
    public consoleInterfaceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
            base(endpointConfigurationName, remoteAddress)
    {
    }
    
    public consoleInterfaceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
            base(binding, remoteAddress)
    {
    }
    
    public string NumberChecker(int val1, int val2)
    {
        return base.Channel.NumberChecker(val1, val2);
    }
    
    public System.Threading.Tasks.Task<string> NumberCheckerAsync(int val1, int val2)
    {
        return base.Channel.NumberCheckerAsync(val1, val2);
    }
    
    public int SecretNumber(int x, int y)
    {
        return base.Channel.SecretNumber(x, y);
    }
    
    public System.Threading.Tasks.Task<int> SecretNumberAsync(int x, int y)
    {
        return base.Channel.SecretNumberAsync(x, y);
    }
}
