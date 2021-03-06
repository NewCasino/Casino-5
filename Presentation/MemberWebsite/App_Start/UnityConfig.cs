using System;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;

namespace AFT.RegoV2.MemberWebsite
{
    public class UnityConfig
    {
        private static readonly Lazy<IUnityContainer> Container = new Lazy<IUnityContainer>(() =>
        {
            var container = new MemberWebsiteContainerFactory().CreateWithRegisteredTypes();

            RegisterTypes(container);

            return container;
        });
        
        public static IUnityContainer GetConfiguredContainer()
        {
            return Container.Value;
        }
        
        public static void RegisterTypes(IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below. Make sure to add a Microsoft.Practices.Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            
        }
    }
}
