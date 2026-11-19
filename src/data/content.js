// ─────────────────────────────────────────────────────────────
//  CONTENIDO DEL PROYECTO
//  Todo el texto de la web vive aquí. Revisadlo y reescribidlo
//  con vuestras palabras antes de entregar (criterio de la rúbrica).
// ─────────────────────────────────────────────────────────────

export const blocks = [
  {
    id: 'delitos',
    index: '01',
    title: 'Delitos informáticos',
    kicker: 'Ataques técnicos',
    intro:
      'Ataques en los que el delincuente usa la tecnología como arma: correos trampa, llamadas falsas, cajeros manipulados, programas maliciosos o vídeos creados con IA. Su objetivo es robarte datos, dinero o el control de tus dispositivos.',
  },
  {
    id: 'fraudes',
    index: '02',
    title: 'Fraudes digitales cotidianos',
    kicker: 'Engaños del día a día',
    intro:
      'Engaños que no necesitan conocimientos técnicos, solo una buena historia: un chollo en Wallapop, un piso barato, un trabajo fácil o un paquete retenido. Funcionan porque se cuelan en cosas que hacemos todos los días.',
  },
]

export const scams = [
  // ═════════════ BLOQUE 1 · DELITOS INFORMÁTICOS ═════════════
  {
    id: 'phishing',
    block: 'delitos',
    title: 'Phishing',
    tag: 'Email · Web falsa',
    hue: 0.55,
    short: 'Correos o webs falsas que se hacen pasar por tu banco, una tienda o un organismo oficial.',
    que: 'El phishing es un engaño en el que alguien se hace pasar por una empresa o institución de confianza para que le des tus contraseñas, datos bancarios o información personal. El nombre viene de "fishing" (pescar): lanzan el anzuelo a miles de personas y esperan a que alguien pique.',
    como: [
      'Recibes un correo que parece de tu banco, de Hacienda o de una tienda conocida, con su logo y sus colores.',
      'El mensaje mete prisa: "tu cuenta será bloqueada", "tienes una devolución pendiente", "multa sin pagar".',
      'Incluye un enlace a una web que es una copia casi perfecta de la original.',
      'Escribes tu usuario, contraseña o tarjeta y los datos van directos al estafador.',
    ],
    ejemplo:
      'Una de las campañas más repetidas en España suplanta a la DGT: llega un correo o SMS avisando de una "multa pendiente" con un enlace para pagarla. La DGT ha recordado varias veces que nunca notifica multas por SMS ni por correo con enlaces de pago. Lo mismo pasa con falsas "devoluciones" de la Agencia Tributaria en época de la renta.',
    senales: [
      'Remitente con una dirección rara (por ejemplo, soporte@bbva-seguridad-clientes.com).',
      'Urgencia o amenazas: "en 24 horas", "último aviso".',
      'Te piden datos que tu banco ya tiene o que nunca te pediría.',
      'Enlaces cuya dirección real no coincide con la web oficial.',
    ],
    consejos: [
      'No pulses enlaces de correos inesperados: entra tú escribiendo la dirección o desde la app oficial.',
      'Pasa el ratón por encima del enlace (sin hacer clic) para ver a dónde lleva de verdad.',
      'Activa la verificación en dos pasos en tus cuentas importantes.',
    ],
  },
  {
    id: 'vishing',
    block: 'delitos',
    title: 'Vishing / Smishing',
    tag: 'Llamada · SMS',
    hue: 0.62,
    short: 'Llamadas o SMS fraudulentos que se cuelan incluso entre los mensajes reales de tu banco.',
    que: 'Son la versión por teléfono del phishing. El vishing (voice + phishing) usa llamadas y el smishing (SMS + phishing) usa mensajes de texto. Con una técnica llamada spoofing, el estafador puede hacer que en tu pantalla aparezca el número o el nombre real de tu banco.',
    como: [
      'Te llega un SMS que aparece dentro del mismo hilo que los mensajes auténticos de tu banco.',
      'Te avisa de un "acceso sospechoso" y te pide entrar en un enlace o esperar una llamada.',
      'Te llama un supuesto "agente de seguridad", muy amable y con datos tuyos reales.',
      'Te pide el código que te acaba de llegar por SMS "para cancelar la operación". En realidad es el código para autorizarla.',
    ],
    ejemplo:
      'El timo del "Hola mamá" se hizo viral en España: llega un WhatsApp de un número desconocido diciendo "Hola mamá, se me ha roto el móvil, este es mi número nuevo". Tras unos mensajes, el falso hijo pide dinero urgente para pagar una factura. La Policía Nacional y el INCIBE han alertado de este engaño en repetidas ocasiones.',
    senales: [
      'Que el número o el nombre parezcan del banco no garantiza nada: se pueden falsificar.',
      'Te piden códigos que te llegan por SMS: ningún banco te los pedirá nunca.',
      'Un familiar "con número nuevo" que pide dinero con prisa.',
    ],
    consejos: [
      'Cuelga y llama tú al número oficial que aparece en tu tarjeta o en la web del banco.',
      'Nunca compartas un código de verificación con nadie, ni siquiera con "el banco".',
      'Si un familiar pide dinero, llámale a su número de siempre o hazle una pregunta que solo él sepa responder.',
    ],
  },
  {
    id: 'skimming',
    block: 'delitos',
    title: 'Skimming',
    tag: 'Cajero · TPV',
    hue: 0.08,
    short: 'Robo de los datos de tu tarjeta con cajeros o datáfonos manipulados.',
    que: 'El skimming consiste en copiar la información de la banda magnética de una tarjeta mediante un aparato oculto (un "skimmer") colocado en un cajero, un surtidor de gasolina o un datáfono. Si además consiguen tu PIN, pueden clonar la tarjeta y sacar dinero.',
    como: [
      'Colocan una carcasa falsa sobre la ranura del cajero que lee la tarjeta al meterla.',
      'Instalan una minicámara o un teclado falso encima del real para capturar el PIN.',
      'Con esos datos fabrican una copia de la tarjeta.',
      'Usan la tarjeta clonada para sacar dinero, a menudo en otro país.',
    ],
    ejemplo:
      'Las fuerzas de seguridad españolas han desarticulado en distintas ocasiones bandas que instalaban dispositivos de skimming en cajeros de zonas turísticas y en gasolineras. Por eso los bancos han migrado al chip y al pago sin contacto, que son mucho más difíciles de copiar que la banda magnética.',
    senales: [
      'Piezas que se mueven, están sueltas o tienen un color distinto al resto del cajero.',
      'La ranura sobresale más de lo normal o el teclado se ve más grueso.',
      'Pegamento, rayadas o agujeros pequeños cerca del teclado (posible cámara).',
    ],
    consejos: [
      'Tapa siempre el teclado con la otra mano al escribir el PIN.',
      'Usa cajeros dentro de oficinas bancarias y paga con el móvil o sin contacto cuando puedas.',
      'Activa las notificaciones de la app del banco para ver cada cargo al instante.',
    ],
  },
  {
    id: 'qrshing',
    block: 'delitos',
    title: 'QRshing',
    tag: 'Código QR',
    hue: 0.78,
    short: 'Códigos QR falsos que te llevan a webs peligrosas o de pago trampa.',
    que: 'El QRshing (o "quishing") es phishing a través de códigos QR. Como un QR no se puede leer a simple vista, no sabes a dónde te lleva hasta que lo escaneas. Los estafadores pegan sus propios códigos encima de los legítimos.',
    como: [
      'Pegan una pegatina con un QR falso sobre el original en un parquímetro, una carta de restaurante o un cartel.',
      'Al escanearlo, llegas a una web que imita la de pago oficial.',
      'Introduces tu tarjeta para pagar el aparcamiento o la cuenta.',
      'El dinero y los datos de la tarjeta van al estafador.',
    ],
    ejemplo:
      'En varias ciudades de España y de Europa se han encontrado pegatinas con QR falsos en parquímetros, y los ayuntamientos han tenido que avisar a los conductores de que solo usen la app oficial. También se han enviado cartas en papel con QR que dirigían a webs fraudulentas.',
    senales: [
      'El QR es una pegatina puesta encima de otro código o de la superficie original.',
      'La dirección que muestra el móvil al escanear no es la oficial.',
      'Te piden datos de tarjeta para algo que normalmente se paga de otra manera.',
    ],
    consejos: [
      'Antes de abrir el enlace, lee la dirección que te muestra la cámara.',
      'Para pagar, usa siempre la app oficial (del parking, del ayuntamiento, etc.).',
      'Desconfía de QR en sitios públicos que no tengan una razón clara para estar ahí.',
    ],
  },
  {
    id: 'simswapping',
    block: 'delitos',
    title: 'SIM Swapping',
    tag: 'Móvil · Duplicado',
    hue: 0.95,
    short: 'Consiguen un duplicado de tu tarjeta SIM y reciben tus SMS y códigos del banco.',
    que: 'El SIM swapping consiste en conseguir un duplicado de tu tarjeta SIM haciéndose pasar por ti ante tu compañía de móvil. A partir de ese momento, tu número funciona en el teléfono del delincuente: recibe tus llamadas, tus SMS y, lo más peligroso, los códigos de verificación del banco.',
    como: [
      'Reúnen tus datos personales (nombre, DNI, dirección) con phishing o de filtraciones.',
      'Llaman o van a una tienda de tu operadora haciéndose pasar por ti y piden un duplicado.',
      'Tu móvil se queda de repente "sin servicio".',
      'Con tu número entran en tu banca online, cambian contraseñas y vacían la cuenta.',
    ],
    ejemplo:
      'La Policía Nacional ha desarticulado varias organizaciones en España que robaban dinero con duplicados de SIM. La Agencia Española de Protección de Datos (AEPD) llegó a multar a varias operadoras por entregar duplicados sin comprobar bien la identidad del cliente.',
    senales: [
      'Tu móvil pierde la cobertura de golpe y sin motivo.',
      'Te llega un aviso de cambio de SIM que no has pedido.',
      'No puedes entrar en cuentas que antes funcionaban.',
    ],
    consejos: [
      'Si te quedas sin servicio de repente, llama a tu operadora desde otro teléfono cuanto antes.',
      'No publiques tu DNI, dirección ni número de teléfono en redes.',
      'Cuando puedas, usa una app de autenticación en vez de códigos por SMS.',
    ],
  },
  {
    id: 'ransomware',
    block: 'delitos',
    title: 'Ransomware y malware',
    tag: 'Software malicioso',
    hue: 0.0,
    short: 'Programas que secuestran tus archivos, te espían o dañan tu equipo.',
    que: 'El malware es cualquier programa malicioso: virus, troyanos, programas espía... El ransomware es un tipo especialmente dañino que cifra (bloquea) todos tus archivos y pide un rescate, normalmente en criptomonedas, a cambio de la clave para recuperarlos.',
    como: [
      'Entra por un archivo adjunto, un programa pirata, una "app" falsa o una vulnerabilidad sin parchear.',
      'Se ejecuta en segundo plano sin que lo notes.',
      'Cifra tus documentos, fotos y copias, o roba tus contraseñas.',
      'Aparece una pantalla pidiendo un pago para liberar los archivos. Pagar no garantiza recuperarlos.',
    ],
    ejemplo:
      'En 2017, el ransomware WannaCry afectó a cientos de miles de ordenadores en todo el mundo, incluida Telefónica en España. En marzo de 2023, un ataque de ransomware paralizó parte de los sistemas del Hospital Clínic de Barcelona, que tuvo que reprogramar consultas y operaciones.',
    senales: [
      'El equipo va muy lento, se calienta o aparecen ventanas y programas que no has instalado.',
      'Archivos con extensiones raras que no se pueden abrir.',
      'Te pide desactivar el antivirus para "instalar" algo.',
    ],
    consejos: [
      'Mantén actualizados el sistema y las apps: las actualizaciones cierran agujeros de seguridad.',
      'Haz copias de seguridad periódicas en un disco desconectado o en la nube.',
      'No descargues programas ni juegos pirata: son la puerta de entrada favorita del malware.',
    ],
  },
  {
    id: 'deepfakes',
    block: 'delitos',
    title: 'Deepfakes y suplantación con IA',
    tag: 'Vídeo · Voz · IA',
    hue: 0.7,
    short: 'Vídeos, fotos o audios falsos creados con inteligencia artificial.',
    que: 'Un deepfake es un contenido falso (vídeo, imagen o voz) generado con inteligencia artificial para que parezca real. Con unos pocos segundos de audio se puede clonar una voz, y con algunas fotos se puede poner la cara de alguien en un vídeo que nunca grabó.',
    como: [
      'Recopilan fotos, vídeos o audios de la víctima, a menudo sacados de redes sociales.',
      'Usan IA para generar un vídeo o una voz casi idénticos.',
      'Lo usan para pedir dinero, anunciar inversiones falsas o dañar la reputación de alguien.',
      'Como "lo hemos visto con nuestros ojos", nos lo creemos.',
    ],
    ejemplo:
      'En 2024, un empleado de la empresa Arup en Hong Kong transfirió unos 25 millones de dólares tras una videollamada en la que todos los "directivos" eran deepfakes. En España circulan anuncios falsos con la cara y la voz de famosos recomendando inversiones. Y en 2023, en Almendralejo (Badajoz), se difundieron desnudos falsos de chicas menores creados con IA, un caso que acabó en los tribunales.',
    senales: [
      'Parpadeos raros, labios que no encajan con la voz o bordes borrosos en la cara.',
      'Voz algo robótica, sin respiraciones o con una entonación extraña.',
      'Peticiones urgentes de dinero o secretos, aunque "veas" a la persona.',
    ],
    consejos: [
      'Acordad en familia una palabra clave secreta para emergencias.',
      'Si algo te parece raro, corta y contacta a esa persona por otra vía.',
      'Crear o compartir deepfakes de otra persona puede ser delito: no lo hagas y denúncialo.',
    ],
  },

  // ═════════════ BLOQUE 2 · FRAUDES DIGITALES COTIDIANOS ═════════════
  {
    id: 'compraventa',
    block: 'fraudes',
    title: 'Compraventa entre particulares',
    tag: 'Wallapop · Vinted',
    hue: 0.42,
    short: 'Falsos compradores o vendedores que te sacan de la app para engañarte.',
    que: 'Son estafas en plataformas de segunda mano como Wallapop o Vinted. El truco casi siempre es el mismo: sacarte de la app oficial (donde estás protegido) para llevarte a WhatsApp, a un correo o a un enlace falso.',
    como: [
      'Un "comprador" se interesa muchísimo por tu producto, sin regatear.',
      'Te pide seguir la conversación por WhatsApp o por correo.',
      'Te envía un enlace a una web falsa de "envíos de Wallapop" para "recibir el pago".',
      'Te pide los datos de tu tarjeta. En vez de cobrar, te quitan el dinero.',
    ],
    ejemplo:
      'Wallapop y la Policía Nacional han avisado muchas veces de los enlaces falsos de "Wallapop Envíos" que llegan por WhatsApp o correo. Como vendedor, nunca necesitas dar tu tarjeta para cobrar: el dinero se recibe dentro de la propia app.',
    senales: [
      'Quiere hablar fuera de la app desde el primer mensaje.',
      'Te pide datos de tarjeta para pagarte a ti.',
      'Precio demasiado bajo o un vendedor que solo acepta Bizum o transferencia.',
    ],
    consejos: [
      'Haz toda la operación (chat, pago y envío) dentro de la app oficial.',
      'Revisa las valoraciones y la antigüedad del perfil.',
      'Si quedas en persona, hazlo en un sitio público y paga al ver el producto.',
    ],
  },
  {
    id: 'alquileres',
    block: 'fraudes',
    title: 'Falsos alquileres',
    tag: 'Booking · Airbnb',
    hue: 0.12,
    short: 'Pisos o apartamentos de vacaciones que no existen o no son de quien los anuncia.',
    que: 'El estafador publica un anuncio de un piso o un apartamento de vacaciones (con fotos robadas de otros anuncios) a un precio muy atractivo. El objetivo es cobrar una fianza o una reserva por una vivienda que no existe o que no es suya.',
    como: [
      'Ves un piso precioso, bien situado y bastante más barato de lo normal.',
      'El "propietario" dice que está en el extranjero y no puede enseñarlo.',
      'Te pide pagar la fianza por transferencia o en una web que imita a Airbnb o Booking.',
      'Después de pagar, desaparece. Cuando llegas, el piso no existe o vive otra persona.',
    ],
    ejemplo:
      'Cada verano, la Policía Nacional y la Guardia Civil lanzan campañas de aviso sobre alquileres vacacionales falsos, con detenidos que llegaron a estafar a decenas de familias con el mismo anuncio. La OCU también ha alertado de webs que copian el diseño de Booking para cobrar reservas falsas.',
    senales: [
      'Precio muy por debajo del mercado en una zona cara.',
      'Excusas para no enseñar el piso ni hacer una videollamada.',
      'Te piden pagar fuera de la plataforma o por adelantado y con prisa.',
    ],
    consejos: [
      'Paga siempre dentro de la plataforma oficial, nunca por transferencia directa.',
      'Busca las fotos del anuncio en Google Imágenes para ver si aparecen en otros sitios.',
      'Pide un contrato y comprueba que quien alquila es el dueño de verdad.',
    ],
  },
  {
    id: 'bizum',
    block: 'fraudes',
    title: 'Estafas por Bizum',
    tag: 'Pagos instantáneos',
    hue: 0.48,
    short: 'Te piden dinero haciéndote creer que te lo están enviando.',
    que: 'Bizum es rapidísimo y muy cómodo, y por eso lo usan los estafadores: el dinero llega en segundos y es muy difícil recuperarlo. La trampa más común es enviarte una solicitud de dinero en lugar de un pago.',
    como: [
      'Vendes algo y el comprador dice: "Te envío el Bizum ahora".',
      'En vez de un pago, te manda una solicitud de dinero.',
      'Te dice "acéptalo para recibirlo" y tú, confiado, lo aceptas.',
      'En realidad acabas de pagarle tú a él.',
    ],
    ejemplo:
      'Es uno de los fraudes de los que más alerta el INCIBE. Otra variante es "te he hecho un Bizum por error, ¿me lo devuelves?", cuando en realidad nunca has recibido nada o el dinero venía de una tarjeta robada.',
    senales: [
      'Para recibir dinero nunca tienes que aceptar nada ni meter tu PIN.',
      'Alguien que insiste mucho en que "aceptes" el Bizum.',
      'Devoluciones "por error" de personas que no conoces.',
    ],
    consejos: [
      'Lee bien la pantalla: "Solicitud de dinero" significa que pagas tú.',
      'Usa Bizum solo con gente de confianza.',
      'Si alguien dice que te pagó por error, comprueba el saldo en la app del banco antes de devolver nada.',
    ],
  },
  {
    id: 'empleo',
    block: 'fraudes',
    title: 'Ofertas falsas de empleo o becas',
    tag: 'InfoJobs · Indeed · Telegram',
    hue: 0.3,
    short: 'Trabajos "de ensueño" que te cobran a ti o te convierten en cómplice.',
    que: 'Son ofertas de trabajo o becas que no existen. Buscan cobrarte dinero (por un "curso", un "kit de inicio" o una "tasa"), robarte datos personales o, en el peor caso, usarte como "mula": alguien que mueve dinero robado a través de su cuenta.',
    como: [
      'Te escriben por WhatsApp o Telegram: "Gana 300 € al día desde casa dando likes".',
      'Al principio te pagan pequeñas cantidades para ganarse tu confianza.',
      'Después te piden "invertir" o pagar para desbloquear tareas mejor pagadas.',
      'O te ofrecen dinero por dejar que pase una transferencia por tu cuenta.',
    ],
    ejemplo:
      'Las "estafas de tareas" (dar likes a vídeos o reseñas a cambio de dinero) se han disparado en España, según han alertado el INCIBE y la Policía Nacional. Además, Europol hace campañas cada año porque muchos jóvenes acaban siendo "mulas de dinero" sin saber que eso es un delito de blanqueo.',
    senales: [
      'Mucho dinero por muy poco esfuerzo y sin entrevista.',
      'Contacto por WhatsApp o Telegram de alguien que no conoces.',
      'Te piden pagar algo antes de empezar a trabajar.',
    ],
    consejos: [
      'Un trabajo real nunca te pide dinero para empezar.',
      'Busca la empresa en internet y comprueba que existe de verdad.',
      'Nunca prestes tu cuenta bancaria a nadie: si mueven dinero robado, el responsable eres tú.',
    ],
  },
  {
    id: 'paqueteria',
    block: 'fraudes',
    title: 'Estafas de paquetería',
    tag: 'Correos · Seur · DHL',
    hue: 0.1,
    short: 'SMS de un paquete "retenido" que solo se libera pagando una pequeña tasa.',
    que: 'Se aprovechan de que hoy casi todos esperamos algún paquete. Envían SMS o correos que imitan a Correos, Seur, DHL o la propia aduana diciendo que tu envío está retenido.',
    como: [
      'Te llega: "Su paquete no ha podido ser entregado. Pague 1,99 € de gastos de envío".',
      'El enlace te lleva a una web idéntica a la de la empresa de mensajería.',
      'Introduces tu tarjeta para pagar una cantidad pequeña.',
      'Con los datos, hacen cargos mucho mayores o te suscriben a pagos mensuales.',
    ],
    ejemplo:
      'Correos tiene en su web una sección permanente de avisos de fraude, porque este SMS falso circula todo el año. Los picos llegan en Black Friday y Navidad, justo cuando más paquetes esperamos. Ojo: el Black Friday de este año es el 27 de noviembre.',
    senales: [
      'Una cantidad muy pequeña para que no lo pienses dos veces.',
      'No estabas esperando ningún paquete o no es de esa empresa.',
      'El enlace no pertenece al dominio oficial (correos.es, seur.com, dhl.com).',
    ],
    consejos: [
      'Consulta el estado del envío con el número de seguimiento en la web o la app oficial.',
      'No pagues tasas desde enlaces de SMS.',
      'Reenvía el SMS sospechoso al 017 (INCIBE) o denúncialo.',
    ],
  },
  {
    id: 'redes',
    block: 'fraudes',
    title: 'Fraudes en redes sociales',
    tag: 'Sorteos · Perfiles clonados',
    hue: 0.85,
    short: 'Sorteos falsos, perfiles clonados de influencers y robo de cuentas.',
    que: 'Las redes sociales son el sitio perfecto para estafar: mucha gente joven, mucha confianza y mucha información personal a la vista. Aquí entran los sorteos falsos, los perfiles clonados de influencers o marcas y los robos de cuentas.',
    como: [
      'Una cuenta clonada de un influencer te escribe: "¡Has ganado el sorteo!".',
      'Para recibir el premio tienes que pagar el envío o dar tus datos.',
      'Otra variante: un amigo (con la cuenta ya robada) te pide "votar por él" enviándole un código.',
      'Ese código era el de verificación de tu WhatsApp o Instagram. Ahora tu cuenta es suya.',
    ],
    ejemplo:
      'El timo de "¿me ayudas votando en un concurso?" ha robado miles de cuentas de WhatsApp en España. Cada cuenta robada se usa para engañar a todos sus contactos y la cadena sigue. Las marcas y los influencers avisan a menudo de que sus sorteos nunca piden pagar nada.',
    senales: [
      'Cuentas con nombres casi iguales (un punto o una letra de más) y pocos seguidores.',
      'Premios que exigen pagar un envío o una "tasa".',
      'Cualquier mensaje que te pida reenviar un código que te ha llegado por SMS.',
    ],
    consejos: [
      'Un código de verificación es como la llave de tu casa: no se lo des a nadie.',
      'Activa la verificación en dos pasos en WhatsApp, Instagram y TikTok.',
      'Pon tus perfiles en privado y revisa quién te sigue.',
    ],
  },
  {
    id: 'tiendas',
    block: 'fraudes',
    title: 'Tiendas online fraudulentas',
    tag: 'Clones · Chollos',
    hue: 0.58,
    short: 'Webs que copian marcas conocidas con precios "demasiado buenos para ser verdad".',
    que: 'Son tiendas online falsas que copian el diseño de marcas famosas o se inventan una marca con precios irresistibles. O no te llega nada, o te llega una falsificación, o usan tu tarjeta para otras compras.',
    como: [
      'Ves un anuncio en Instagram o TikTok: zapatillas de marca con un 70 % de descuento.',
      'La web parece profesional, con cuenta atrás de "oferta solo hoy".',
      'Pagas con tarjeta o, peor, por transferencia.',
      'El pedido nunca llega y la web desaparece en unas semanas.',
    ],
    ejemplo:
      'Cada Black Friday aparecen cientos de webs clon de marcas como Nike, Zara o Ikea. El INCIBE y la OCU publican cada año guías para detectarlas. El candado del navegador (HTTPS) no sirve como prueba: las tiendas falsas también lo tienen.',
    senales: [
      'Descuentos enormes en productos que nunca se rebajan tanto.',
      'Dominio raro (nike-outlet-es-oferta.shop) o recién creado.',
      'Sin aviso legal, sin CIF, sin dirección física o con textos mal traducidos.',
    ],
    consejos: [
      'Busca "nombre de la tienda + opiniones" antes de comprar.',
      'Paga con métodos que permitan reclamar (tarjeta o PayPal), nunca por transferencia.',
      'Si es demasiado bueno para ser verdad, casi siempre es mentira.',
    ],
  },
  {
    id: 'inversion',
    block: 'fraudes',
    title: 'Fraudes de inversión y cripto',
    tag: 'Falsos mentores',
    hue: 0.15,
    short: 'Ganancias rápidas y "mentores" que te prometen hacerte rico con criptomonedas.',
    que: 'Prometen rentabilidades enormes y sin riesgo invirtiendo en criptomonedas, bolsa o "sistemas secretos". Detrás suele haber chiringuitos financieros (empresas sin autorización) o esquemas piramidales que pagan a los primeros con el dinero de los nuevos.',
    como: [
      'Un "mentor" en Instagram enseña coches, viajes y capturas de ganancias.',
      'Te invita a un grupo de Telegram o te vende un curso.',
      'Te hace invertir en una plataforma que muestra beneficios falsos en pantalla.',
      'Cuando intentas sacar el dinero, te piden más "comisiones" y al final desaparecen.',
    ],
    ejemplo:
      'La CNMV publica constantemente avisos sobre chiringuitos financieros y alerta de que muchos usan anuncios deepfake con famosos españoles. Casos como Forsage o Arbistar, investigados en España como posibles esquemas piramidales, afectaron a miles de personas.',
    senales: [
      'Ganancias "garantizadas" y muy altas en poco tiempo.',
      'Presión: "solo quedan 3 plazas", "hoy o nunca".',
      'La empresa no aparece en los registros de la CNMV.',
    ],
    consejos: [
      'Antes de invertir, busca la empresa en cnmv.es.',
      'Nadie regala dinero: si ganara tanto, no te lo vendería en un curso.',
      'Desconfía de cualquier inversión que te recomiende un desconocido en redes.',
    ],
  },
]

// Pasos cortos para el diagrama animado "Ruta del ataque" de cada dossier
const flows = {
  phishing: ['Correo falso', 'Prisa y miedo', 'Web clonada', 'Datos robados'],
  vishing: ['SMS o llamada', 'Falso agente', 'Te pide el código', 'Cuenta vaciada'],
  skimming: ['Cajero trucado', 'Copian la banda', 'Graban tu PIN', 'Tarjeta clonada'],
  qrshing: ['QR pegado encima', 'Web de pago falsa', 'Metes tu tarjeta', 'Cobro fraudulento'],
  simswapping: ['Reúnen tus datos', 'Piden un duplicado', 'Te quedas sin línea', 'Entran en tu banco'],
  ransomware: ['Archivo infectado', 'Se ejecuta oculto', 'Cifra tus archivos', 'Piden un rescate'],
  deepfakes: ['Copian tu voz y cara', 'La IA la clona', 'Mensaje falso', 'Engaño o chantaje'],
  compraventa: ['Comprador "ideal"', 'Sales de la app', 'Enlace de cobro falso', 'Te vacían la tarjeta'],
  alquileres: ['Piso chollo', 'Dueño "fuera"', 'Pagas la fianza', 'El piso no existe'],
  bizum: ['"Te envío el Bizum"', 'Llega una solicitud', 'La aceptas', 'Pagas tú'],
  empleo: ['Trabajo fácil', 'Primeros pagos', '"Invierte" para seguir', 'Pierdes o eres mula'],
  paqueteria: ['SMS de paquete', 'Tasa de 1,99 €', 'Web clonada', 'Cargos mayores'],
  redes: ['Premio o votación', 'Te piden un código', 'Roban tu cuenta', 'Engañan a tus amigos'],
  tiendas: ['Anuncio chollo', 'Tienda clon', 'Pagas', 'No llega nada'],
  inversion: ['Mentor en redes', 'Ganancias falsas', 'Inviertes más', 'Desaparecen'],
}
scams.forEach((s) => (s.flow = flows[s.id]))

export const tips = [
  { t: 'Verificación en dos pasos', d: 'Actívala en el correo, las redes y el banco. Aunque roben tu contraseña, no podrán entrar.' },
  { t: 'Una contraseña distinta para cada cuenta', d: 'Usa frases largas y un gestor de contraseñas. Si filtran una, el resto sigue a salvo.' },
  { t: 'Los códigos no se comparten', d: 'Ningún banco, empresa ni amigo necesita el código que te llega por SMS. Nunca.' },
  { t: 'No pulses enlaces con prisa', d: 'Entra tú desde la app oficial o escribiendo la dirección. La urgencia es la herramienta favorita del estafador.' },
  { t: 'Comprueba por otra vía', d: 'Si "tu banco" o "tu madre" te pide algo raro, cuelga y llama tú a un número que ya conozcas.' },
  { t: 'Actualiza todo', d: 'Móvil, ordenador y apps. Cada actualización cierra puertas por las que entra el malware.' },
  { t: 'Copias de seguridad', d: 'Guarda tus fotos y archivos en la nube y en un disco aparte. Contra el ransomware, es tu plan B.' },
  { t: 'Cuidado con las redes públicas', d: 'No entres en el banco ni hagas compras conectado a una wifi abierta. Usa tus datos móviles.' },
  { t: 'Comparte menos', d: 'DNI, dirección, horarios o fotos del billete del viaje son oro para un estafador. Perfil privado y menos datos.' },
  { t: 'Pide ayuda y denuncia', d: 'Llama al 017 (INCIBE, gratis y confidencial) y denuncia en la Policía o la Guardia Civil. No es culpa tuya.' },
]

// Mini-juego "¿Estafa o legítimo?"
export const quiz = [
  {
    channel: 'SMS',
    from: 'Correos',
    body: 'Su paquete ES2849XX está retenido en aduanas. Para su entrega abone 1,99€ en: correos-es-envio.com/pago',
    scam: true,
    why: 'El dominio no es correos.es, la cantidad es pequeña a propósito y no esperabas ningún paquete. Es smishing de paquetería.',
  },
  {
    channel: 'WhatsApp',
    from: '+34 6XX XXX 112',
    body: 'Hola mamá, se me ha caído el móvil al agua 😩 este es mi número nuevo. ¿Puedes hacerme un Bizum de 380€? Es urgente, luego te explico',
    scam: true,
    why: 'Número desconocido, prisa y dinero. Es el timo del "Hola mamá". Llama al número de siempre antes de hacer nada.',
  },
  {
    channel: 'App del banco',
    from: 'Notificación push',
    body: 'Compra con tarjeta ****4821 por 12,40 € en MERCADONA LUGO. Si no reconoces este movimiento, revísalo en la app.',
    scam: false,
    why: 'Es un aviso dentro de la app oficial, sin enlaces externos y sin pedirte datos. Así es como avisa un banco de verdad.',
  },
  {
    channel: 'Instagram DM',
    from: '@nike.oficial.sorteos_es',
    body: '🎉 ¡Enhorabuena! Has sido seleccionado ganador de unas Air Max. Solo tienes que pagar 4,95€ de envío aquí 👉 bit.ly/premio-nk',
    scam: true,
    why: 'Cuenta clonada (la oficial es @nike), enlace acortado y un pago para recibir un "premio". Un sorteo de verdad nunca te cobra.',
  },
  {
    channel: 'Llamada',
    from: 'BANCO (número oficial)',
    body: '"Hemos detectado un acceso sospechoso. Para bloquearlo, dígame el código de 6 cifras que le acaba de llegar por SMS."',
    scam: true,
    why: 'El número que aparece se puede falsificar (spoofing). Ningún banco te pide nunca un código. Ese código sirve para autorizar el robo.',
  },
  {
    channel: 'Email',
    from: 'no-reply@accounts.google.com',
    body: 'Se ha iniciado sesión en tu cuenta desde un nuevo dispositivo (Windows, Lugo). Si has sido tú, no tienes que hacer nada.',
    scam: false,
    why: 'Dominio oficial, no pide datos ni mete prisa y no exige pulsar nada. Aun así, si dudas, revísalo entrando tú en myaccount.google.com.',
  },
]

export const sources = [
  { name: 'INCIBE · Ciudadanía (antes OSI)', url: 'https://www.incibe.es/ciudadania', note: 'Avisos de seguridad y guías. Línea de ayuda 017.' },
  { name: 'Policía Nacional', url: 'https://www.policia.es', note: 'Denuncias y alertas sobre ciberdelitos.' },
  { name: 'Guardia Civil · Delitos Telemáticos', url: 'https://www.gdt.guardiacivil.es', note: 'Grupo especializado en delitos informáticos.' },
  { name: 'CNMV', url: 'https://www.cnmv.es', note: 'Advertencias sobre chiringuitos financieros.' },
  { name: 'AEPD', url: 'https://www.aepd.es', note: 'Protección de datos y canal prioritario.' },
  { name: 'Correos · Avisos de fraude', url: 'https://www.correos.es', note: 'Ejemplos de SMS y correos falsos.' },
  { name: 'OCU', url: 'https://www.ocu.org', note: 'Guías para detectar tiendas online fraudulentas.' },
  { name: 'Europol', url: 'https://www.europol.europa.eu', note: 'Campañas europeas contra las mulas de dinero.' },
]

export const credits = {
  authors: ['Juan Castedo', 'Nombre Compañero/a'],
  course: '4º ESO · Colegio Diocesano María Auxiliadora · Lugo',
  year: '2026',
}
