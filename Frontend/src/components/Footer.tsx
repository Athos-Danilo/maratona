import React from 'react';
import { Mail, ShieldCheck, CreditCard, Lock, Users } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            {/* Newsletter Banner */}
            <div className="footer-newsletter-banner">
                <div className="newsletter-banner-container">
                    <div className="newsletter-text">
                        <h3>Ganhe 10% na primeira compra</h3>
                        <p>Cadastre-se para receber ofertas exclusivas e dicas de alta performance.</p>
                    </div>
                    <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Inscrito com sucesso!'); }}>
                        <input type="email" placeholder="Seu melhor e-mail" required />
                        <button type="submit">Garantir 10% OFF</button>
                    </form>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer-main">
                <div className="footer-brand-column">
                    <h2>MARATONA</h2>
                    <p>Equipamentos de alta performance para superar seus limites todos os dias. O esporte no seu sangue.</p>
                    <div className="social-proof-badge">
                        <Users size={18} />
                        <span>+15.000 corredores equipados</span>
                    </div>
                </div>

                <div className="footer-trust-column">
                    <h3>Compra 100% Segura</h3>
                    <div className="security-badges-container">
                        <div className="security-badge">
                            <ShieldCheck size={20} /> <span>Ambiente Seguro</span>
                        </div>
                        <div className="security-badge">
                            <Lock size={20} /> <span>SSL Criptografado</span>
                        </div>
                        <div className="security-badge">
                            <CreditCard size={20} /> <span>Pix & Cartões</span>
                        </div>
                    </div>
                </div>

                <div className="footer-social-column">
                    <h3>Siga-nos</h3>
                    <div className="social-icons">
                        <a href="#" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="#" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                        </a>
                        <a href="#" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        <a href="#" aria-label="E-mail"><Mail size={20} /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} MARATONA. Projetado e desenvolvido por Athos Inácio.</p>
            </div>
        </footer>
    );
};

export default Footer;
