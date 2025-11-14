import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = (_:any) =>{
  // console.log(title,description)
  return(
      <Helmet>
    <title>SaralBuy | Simplifying Online Shopping</title>
    <meta name="description" content={'SaralBuy | Simplifying Online Shopping'} />
  </Helmet>
  )
};

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
