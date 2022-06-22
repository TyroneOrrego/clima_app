require("dotenv").config();
const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostrar mensaje
        const termino = await leerInput("Ciudad: ");

        //Buscar el lugar
        const lugares = await busquedas.ciudad(termino);

        //Selecccionar el  lugar
        const id = await listarLugares(lugares);

        if (id === '0' ) continue;

        
        const lugarSel = lugares.find((l) => l.id === id);
        
        //guardar en DB

        busquedas.agregarHistorial( lugarSel.nombre );

        //Clima
        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

        // Mostrar resultados
        console.clear();
        console.log("\n Información de la ciudad\n".green);
        console.log("Ciudad:", lugarSel.nombre.green);
        console.log("Lat:", lugarSel.lat);
        console.log("Lng:", lugarSel.lng);
        console.log("Temp:", clima.temp);
        console.log("Min: ", clima.min);
        console.log("Max:", clima.max);
        console.log("Cómo está el clima:", clima.desc.green);

        break;


        case 2:

          busquedas.historial.forEach( (lugar, i ) => {
              const idx = `${i + 1 }.`.green;
              console.log (`${ idx } ${lugar}` );
          })

        break;
    }

    if (opt !== 0) await pausa();

    await pausa();
  } while (opt !== 0);
};

main();