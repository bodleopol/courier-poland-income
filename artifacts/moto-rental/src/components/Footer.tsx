import { Link } from "wouter";
import { MapPin, Instagram, Facebook, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 border-t-8 border-primary noise-bg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary text-primary-foreground p-1.5 shadow-xs border-2 border-primary-foreground/20">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="font-display text-3xl tracking-widest text-white">
                MOTOLIMA
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md text-lg mb-8">
              Alquiler de motos en Lima sin complicaciones. 
              Pura calle, pura ruta, pura aventura. 
              Especialistas en la Lifan X-Trial 150.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="footer-social-instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="w-12 h-12 bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="footer-social-facebook">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-xl tracking-widest text-white mb-6 uppercase">Explora</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="#moto" className="hover:text-primary transition-colors">La Moto</a></li>
              <li><a href="#rutas" className="hover:text-primary transition-colors">Rutas</a></li>
              <li><a href="#tarifas" className="hover:text-primary transition-colors">Tarifas</a></li>
              <li><a href="#requisitos" className="hover:text-primary transition-colors">Requisitos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl tracking-widest text-white mb-6 uppercase">Contacto</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Miraflores, Lima<br/>Perú</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+51 999 999 999</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm font-bold tracking-wider uppercase">
          <p>© {new Date().getFullYear()} MotoLima. Todos los derechos reservados.</p>
          <p>Lima, Perú</p>
        </div>
      </div>
    </footer>
  );
}
