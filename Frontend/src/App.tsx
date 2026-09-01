import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const ProdutoDetalhes = lazy(() => import('./pages/ProdutoDetalhes'));
const Carrinho = lazy(() => import('./pages/Carrinho'));
const Checkout = lazy(() => import('./pages/Checkout'));
const StatusCompra = lazy(() => import('./pages/StatusCompra'));
const ComoFiz = lazy(() => import('./pages/ComoFiz'));
const Catalogo = lazy(() => import('./pages/Catalogo'));
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Suspense fallback={<div className="loading-spinner" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/produto/:id" element={<ProdutoDetalhes />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/status-compra" element={<StatusCompra />} />
            <Route path="/como-fiz" element={<ComoFiz />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;