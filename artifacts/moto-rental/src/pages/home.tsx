import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ShieldCheck, 
  Map, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  IdCard, 
  CreditCard, 
  MapPin
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <Navigation />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section 
          ref={heroRef}
          className="relative h-[100dvh] min-h-[600px] flex items-center overflow-hidden"
          data-testid="section-hero"
        >
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y, opacity }}
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img 
              src="/hero-bg.png" 
              alt="Lifan X-Trial 150 en la Costa Verde" 
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          <div className="container mx-auto px-4 relative z-20 pt-20">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-block bg-primary text-primary-foreground px-4 py-1.5 font-bold tracking-widest text-sm uppercase mb-6 shadow-xs border border-primary-foreground/20">
                  Lima, Perú
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl lg:text-9xl text-white leading-[0.9] mb-6 drop-shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                LA CALLE <br/>
                <span className="text-primary">TE ESPERA</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl font-medium"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Alquiler de Lifan X-Trial 150. Sin complicaciones. 
                Lista para el tráfico limeño, la Costa Verde y las rutas de montaña.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Button 
                  size="lg" 
                  className="rounded-none border-2 border-primary h-16 px-10 text-xl font-display tracking-widest shadow-sm"
                  asChild
                  data-testid="hero-cta-reservar"
                >
                  <a href="#reservar">
                    RESERVAR AHORA
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-none border-2 border-white text-white hover:bg-white hover:text-black h-16 px-10 text-xl font-display tracking-widest shadow-sm bg-transparent backdrop-blur-sm"
                  asChild
                  data-testid="hero-cta-tarifas"
                >
                  <a href="#tarifas">
                    VER TARIFAS
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white flex flex-col items-center animate-bounce">
            <span className="text-xs tracking-[0.3em] font-bold mb-2 uppercase">Desliza</span>
            <ArrowRight className="w-6 h-6 rotate-90" />
          </div>
        </section>

        {/* POR QUÉ NOSOTROS */}
        <section className="py-24 bg-background noise-bg relative z-20" id="nosotros">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b-4 border-foreground pb-8">
              <h2 className="text-5xl md:text-7xl">
                CERO <span className="text-primary">FLORO.</span>
              </h2>
              <p className="text-xl max-w-md font-bold uppercase tracking-wide">
                Sabemos lo que necesitas para moverte por Lima. Precios claros, motos guerreras.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-10 border-2 border-border shadow-xs hover:shadow-sm hover:-translate-y-1 transition-all duration-300" data-testid="feature-affordable">
                <Wallet className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-3xl font-display mb-4">PRECIOS JUSTOS</h3>
                <p className="text-muted-foreground text-lg">
                  Sin cargos ocultos. Tarifas por día, semana o mes que se ajustan a tu bolsillo y a tus ganas de rutear.
                </p>
              </div>
              <div className="bg-card p-10 border-2 border-border shadow-xs hover:shadow-sm hover:-translate-y-1 transition-all duration-300" data-testid="feature-reliable">
                <ShieldCheck className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-3xl font-display mb-4">100% OPERATIVAS</h3>
                <p className="text-muted-foreground text-lg">
                  Mantenimiento al día. Te entregamos la moto lista para devorar kilómetros sin preocupaciones mecánicas.
                </p>
              </div>
              <div className="bg-card p-10 border-2 border-border shadow-xs hover:shadow-sm hover:-translate-y-1 transition-all duration-300" data-testid="feature-freedom">
                <Map className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-3xl font-display mb-4">LIBERTAD TOTAL</h3>
                <p className="text-muted-foreground text-lg">
                  Evita el tráfico infernal de Javier Prado. Escápate a las sierras de Canta o bordea el mar en la Costa Verde.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LA MOTO */}
        <section className="py-24 bg-secondary text-secondary-foreground noise-bg" id="moto">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 border-2 border-foreground" />
                <img 
                  src="/moto-detail.png" 
                  alt="Detalle Lifan X-Trial 150" 
                  className="relative z-10 w-full object-cover border-2 border-foreground h-[600px] grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-primary text-2xl font-bold tracking-widest mb-4">NUESTRA MÁQUINA</h2>
                <h3 className="text-6xl md:text-8xl text-white mb-8">
                  LIFAN <br/>
                  <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>X-TRIAL 150</span>
                </h3>
                
                <p className="text-xl text-gray-300 mb-10 border-l-4 border-primary pl-6">
                  Una moto dual-sport ligera pero fiera. Diseñada para aguantar los huecos de la ciudad y el polvo de las trochas. 
                  Con un motor de 150cc, tienes la agilidad perfecta para filtrar en el tráfico y la fuerza necesaria para las subidas.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-12">
                  <div>
                    <span className="block text-primary font-display text-4xl mb-1">150cc</span>
                    <span className="text-sm font-bold tracking-widest uppercase">Motor</span>
                  </div>
                  <div>
                    <span className="block text-primary font-display text-4xl mb-1">12L</span>
                    <span className="text-sm font-bold tracking-widest uppercase">Tanque</span>
                  </div>
                  <div>
                    <span className="block text-primary font-display text-4xl mb-1">130kg</span>
                    <span className="text-sm font-bold tracking-widest uppercase">Peso</span>
                  </div>
                  <div>
                    <span className="block text-primary font-display text-4xl mb-1">Dual</span>
                    <span className="text-sm font-bold tracking-widest uppercase">Propósito</span>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="rounded-none border-2 border-primary h-16 px-10 text-xl font-display tracking-widest w-full sm:w-auto"
                  asChild
                  data-testid="moto-cta-whatsapp"
                >
                  <a href="https://wa.me/51946408628" target="_blank" rel="noopener noreferrer">
                    QUIERO MANEJARLA
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* RUTAS */}
        <section className="py-24 bg-background noise-bg" id="rutas">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl md:text-7xl mb-16 text-center border-b-4 border-foreground pb-8">
              TU CIUDAD. <span className="text-primary">TUS REGLAS.</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative overflow-hidden border-4 border-foreground bg-foreground">
                <img 
                  src="/lima-streets.png" 
                  alt="Manejando en Lima" 
                  className="w-full h-[500px] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-4xl font-display text-white mb-2">LA SELVA DE CEMENTO</h3>
                  <p className="text-gray-300 font-bold uppercase tracking-wide">Domina el tráfico limeño</p>
                </div>
              </div>
              
              <div className="group relative overflow-hidden border-4 border-foreground bg-foreground">
                <img 
                  src="/mountain-road.png" 
                  alt="Rutas cerca a Lima" 
                  className="w-full h-[500px] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-4xl font-display text-white mb-2">ESCAPES CERCANOS</h3>
                  <p className="text-gray-300 font-bold uppercase tracking-wide">Cieneguilla, Azpitia, Antioquía</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TARIFAS */}
        <section className="py-24 bg-primary text-primary-foreground noise-bg" id="tarifas">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl text-white mb-4">TARIFAS</h2>
              <p className="text-xl font-bold uppercase tracking-widest text-black">Precios claros. Sin sorpresas.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Dia */}
              <div className="bg-background text-foreground border-4 border-black p-8 hover:-translate-y-2 transition-transform shadow-xs relative" data-testid="pricing-card-day">
                <h3 className="text-3xl font-display mb-2">POR DÍA</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-display">S/ 60</span>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider">/24 hrs</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Casco incluido</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>SOAT vigente</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Kilometraje libre (Lima)</span></li>
                </ul>
                <Button className="w-full rounded-none border-2 border-black h-14 text-lg font-display tracking-widest" asChild data-testid="btn-rent-day">
                  <a href="https://wa.me/51946408628?text=Hola,%20quiero%20alquilar%20por%20un%20día" target="_blank" rel="noopener noreferrer">RESERVAR</a>
                </Button>
              </div>

              {/* Semana */}
              <div className="bg-black text-white border-4 border-black p-8 hover:-translate-y-2 transition-transform shadow-xs relative scale-105 z-10" data-testid="pricing-card-week">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black font-bold uppercase tracking-widest px-4 py-1 text-sm border-2 border-black">
                  MÁS POPULAR
                </div>
                <h3 className="text-3xl font-display mb-2 text-primary">POR SEMANA</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-display">S/ 350</span>
                  <span className="text-gray-400 font-bold uppercase tracking-wider">/7 días</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>2 Cascos incluidos</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>SOAT vigente</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Kilometraje libre</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Soporte 24/7</span></li>
                </ul>
                <Button className="w-full bg-primary text-black hover:bg-white hover:text-black rounded-none border-2 border-primary hover:border-white h-14 text-lg font-display tracking-widest" asChild data-testid="btn-rent-week">
                  <a href="https://wa.me/51946408628?text=Hola,%20quiero%20alquilar%20por%20una%20semana" target="_blank" rel="noopener noreferrer">RESERVAR</a>
                </Button>
              </div>

              {/* Mes */}
              <div className="bg-background text-foreground border-4 border-black p-8 hover:-translate-y-2 transition-transform shadow-xs relative" data-testid="pricing-card-month">
                <h3 className="text-3xl font-display mb-2">POR MES</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-display">S/ 1200</span>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider">/30 días</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Todo lo anterior</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Mantenimiento incluido</span></li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span>Moto de reemplazo</span></li>
                </ul>
                <Button className="w-full rounded-none border-2 border-black h-14 text-lg font-display tracking-widest" asChild data-testid="btn-rent-month">
                  <a href="https://wa.me/51946408628?text=Hola,%20quiero%20alquilar%20por%20un%20mes" target="_blank" rel="noopener noreferrer">CONSULTAR</a>
                </Button>
              </div>
            </div>
            
            <p className="text-center mt-12 text-black font-bold uppercase tracking-wider text-sm">
              *Los precios no incluyen IGV. Se requiere un depósito de garantía.
            </p>
          </div>
        </section>

        {/* REQUISITOS */}
        <section className="py-24 bg-background noise-bg border-b border-border" id="requisitos">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl mb-16 text-center border-b-4 border-foreground pb-8">
                LO QUE <span className="text-primary">NECESITAS.</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="flex gap-6 p-6 border-2 border-border bg-card">
                  <IdCard className="w-10 h-10 text-primary shrink-0" />
                  <div>
                    <h4 className="font-display text-2xl mb-2">DOCUMENTOS</h4>
                    <p className="text-muted-foreground">DNI o Pasaporte vigente y Licencia de conducir (Clase B-IIb o B-IIc).</p>
                  </div>
                </div>
                <div className="flex gap-6 p-6 border-2 border-border bg-card">
                  <CreditCard className="w-10 h-10 text-primary shrink-0" />
                  <div>
                    <h4 className="font-display text-2xl mb-2">GARANTÍA</h4>
                    <p className="text-muted-foreground">Depósito de S/ 500 (Efectivo o transferencia). Se devuelve al entregar la moto.</p>
                  </div>
                </div>
                <div className="flex gap-6 p-6 border-2 border-border bg-card">
                  <Clock className="w-10 h-10 text-primary shrink-0" />
                  <div>
                    <h4 className="font-display text-2xl mb-2">EDAD</h4>
                    <p className="text-muted-foreground">Mayor de 21 años con experiencia comprobada en motos mecánicas.</p>
                  </div>
                </div>
                <div className="flex gap-6 p-6 border-2 border-border bg-card">
                  <MapPin className="w-10 h-10 text-primary shrink-0" />
                  <div>
                    <h4 className="font-display text-2xl mb-2">RESIDENCIA</h4>
                    <p className="text-muted-foreground">Recibo de luz o agua reciente de donde te estés hospedando en Lima.</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary text-secondary-foreground p-10 border-l-8 border-primary relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-3xl font-display mb-6 text-white">PREGUNTAS FRECUENTES</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-b-background/20">
                      <AccordionTrigger className="text-lg font-bold hover:text-primary data-[state=open]:text-primary text-left">¿Puedo salir de Lima con la moto?</AccordionTrigger>
                      <AccordionContent className="text-gray-400 text-base">
                        Sí, nuestras motos están preparadas para rutas cercanas a Lima como Canta, Antioquía o el sur chico. Sin embargo, para viajes más largos debes notificarnos previamente para evaluar el mantenimiento de la unidad.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-b-background/20">
                      <AccordionTrigger className="text-lg font-bold hover:text-primary data-[state=open]:text-primary text-left">¿Qué pasa si la moto se malogra?</AccordionTrigger>
                      <AccordionContent className="text-gray-400 text-base">
                        Brindamos asistencia telefónica 24/7. Si es una falla mecánica (no por mal uso), te enviamos un mecánico o te cambiamos la moto. Pinchazos de llanta corren por cuenta del cliente.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-b-background/20">
                      <AccordionTrigger className="text-lg font-bold hover:text-primary data-[state=open]:text-primary text-left">¿Me entregan la moto con tanque lleno?</AccordionTrigger>
                      <AccordionContent className="text-gray-400 text-base">
                        Sí, entregamos la moto con tanque lleno y debe ser devuelta de la misma manera. En caso contrario, se cobrará S/ 30 por galón faltante.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOOKING FORM */}
        <section className="py-24 bg-background noise-bg" id="reservar">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b-4 border-foreground pb-8">
                <div>
                  <h2 className="text-5xl md:text-6xl">
                    RESERVA <span className="text-primary">ONLINE.</span>
                  </h2>
                  <p className="text-muted-foreground text-lg mt-2 font-bold uppercase tracking-wide">
                    Sin llamadas. Llena el formulario y te confirmamos por WhatsApp.
                  </p>
                </div>
              </div>
              <BookingForm />
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-32 bg-secondary relative overflow-hidden noise-bg flex items-center justify-center">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,var(--color-primary)_10px,var(--color-primary)_20px)]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-6xl md:text-8xl text-white mb-6 font-display">
              ARRANCA <span className="text-primary">YA.</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-bold uppercase tracking-widest">
              Escríbenos al WhatsApp, separa tu moto y sal a rodar.
            </p>
            <Button 
              size="lg" 
              className="rounded-none border-4 border-primary h-20 px-12 text-2xl font-display tracking-widest shadow-sm hover:scale-105 transition-transform"
              asChild
              data-testid="final-cta-whatsapp"
            >
              <a href="https://wa.me/51946408628" target="_blank" rel="noopener noreferrer">
                CONTACTAR AHORA
              </a>
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
