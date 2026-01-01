import Header from "../components/header/header";
import UrlForm from "../components/UrlForm/UrlForm";
import Tips from "../components/Tips/Tips";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
       <Header />
      <main className="container">
        <UrlForm />
        <Tips />
      </main>
      <Footer />
    </>
  );
}

export default Home;
