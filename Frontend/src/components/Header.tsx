import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCarrinho } from '../contexts/CarrinhoContext';
import './Header.css';

const Header: React.FC = () => {
  const { quantidadeItens } = useCarrinho();
  const [termoBusca, setTermoBusca] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (termoBusca.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(termoBusca.trim())}`);
      setIsMobileMenuOpen(false);
    } else {
      navigate(`/catalogo`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="logo">
          <h1>MARATONA</h1>
        </Link>

        <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/catalogo?genero=Feminino" onClick={() => setIsMobileMenuOpen(false)}>Mulheres</Link>
          <Link to="/catalogo?genero=Masculino" onClick={() => setIsMobileMenuOpen(false)}>Homens</Link>
          <Link to="/catalogo?ofertas=true" onClick={() => setIsMobileMenuOpen(false)}>Outlet</Link>
          <Link to="/como-fiz" className="nav-sobre" onClick={() => setIsMobileMenuOpen(false)}>Como Fiz</Link>
        </nav>

        <div className="header-actions">
          <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Busque por marca, modelo..." 
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
              />
            </form>
          </div>

          <div className="profile-container" ref={profileRef}>
            <button 
              className="profile-btn" 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img src="/Imagens/perfil.jpg" alt="Athos" className="profile-img" />
              <span className="profile-name">Athos</span>
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <a href="#" onClick={(e) => { e.preventDefault(); setIsProfileOpen(false); }}>Configurações</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsProfileOpen(false); }}>Sair</a>
              </div>
            )}
          </div>
          
          <Link to="/carrinho" className="cart-icon">
            <ShoppingCart size={24} />
            {quantidadeItens > 0 && <span className="cart-count">{quantidadeItens}</span>}
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
