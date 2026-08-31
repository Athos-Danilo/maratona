import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ProdutoDetalhes from './pages/ProdutoDetalhes';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import StatusCompra from './pages/StatusCompra';
import ComoFiz from './pages/ComoFiz';
import Catalogo from './pages/Catalogo';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/produto/:id" element={<ProdutoDetalhes />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/status-compra" element={<StatusCompra />} />
          <Route path="/como-fiz" element={<ComoFiz />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;