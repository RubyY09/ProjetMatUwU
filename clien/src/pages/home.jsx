import Test from "../Test";

export default function Home() {

  
  return (
    <div>

   
    <section  className="home  flex-col ps-8 text-start  ">

        <h2 className="text-zinc-50 text-2xl"> <span className="font-bold ">+10 000</span> UTILISATEURS PAR JOUR</h2>
        <h1 className="text-zinc-50 w-6xl  leading-none" >LISTER VOS <span > JEUX</span> FACILEMENT !</h1>
        <a className="bthome rounded-4xl" href="">ALL GAMES</a>
      
         <scipt
        src="/home.js" 
          
      />
   
    </section> <Test /> </div>
  );
}