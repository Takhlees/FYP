
import '@styles/globals.css';


export const metadata = {
  title: "Mailing System",
  description: "Next app",
};

const RootLayout =({ children })=> {
  return (
    <html lang="en">
      
      <body suppressHydrationWarning={true}>
        {children}
      </body>

    </html>
  );
}

export default RootLayout;
