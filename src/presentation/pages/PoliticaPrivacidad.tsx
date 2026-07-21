import LegalLayout from '../components/layout/LegalLayout'

export default function PoliticaPrivacidad() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      subtitle="Información sobre el tratamiento de datos personales conforme al RGPD y la LOPDGDD."
      lastUpdated="21 de julio de 2026"
    >
      <section>
        <h2 className="text-xl font-bold mb-2">1. Responsable del tratamiento</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Titular:</strong> Mundointerino (proyecto en fase de desarrollo; la titularidad como persona física o jurídica se determinará en el momento de su constitución formal).</li>
          <li><strong>Correo electrónico de contacto:</strong> <a href="mailto:mundointerinodev@gmail.com" className="text-[#2F5DAA] underline">mundointerinodev@gmail.com</a></li>
          <li><strong>Sitio web:</strong> https://mundointerino.com</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">2. Finalidad del tratamiento</h2>
        <p>Los datos personales recabados a través del sitio web se tratan con las siguientes finalidades:</p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li><strong>Gestión de la cuenta de usuario:</strong> registro, identificación, mantenimiento de la cuenta y comunicación con el usuario.</li>
          <li><strong>Verificación de la condición de interino:</strong> el documento aportado (nómina, nombramiento, credencial, contrato, certificado de servicios o resolución) tiene como <strong>única finalidad acreditar que el usuario es interino o persona destinataria de la plataforma</strong>, y no se utilizará para ningún uso privado ni comercial. El documento es analizado automáticamente mediante OCR (Tesseract.js, en local) y, si la confianza es baja, revisado manualmente por el equipo de administración. Tras la verificación, el documento se <strong>elimina de forma automática e inmediata</strong> del almacenamiento de Cloudinary.</li>
          <li><strong>Gestión de anuncios de pisos y comunicaciones comunitarias</strong> publicados por el usuario.</li>
          <li><strong>Atención de consultas y reclamaciones</strong> formuladas a través del formulario de contacto o por correo electrónico.</li>
          <li><strong>Cumplimiento de obligaciones legales</strong> (conservación de datos de facturación, logs de seguridad, etc.) cuando proceda.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">3. Legitimación</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Ejecución de un contrato o medidas precontractuales</strong> (art. 6.1.b RGPD): para la gestión de la cuenta y de los servicios solicitados por el usuario.</li>
          <li><strong>Consentimiento del interesado</strong> (art. 6.1.a RGPD): para el tratamiento del documento de verificación, el envío de comunicaciones comerciales cuando el usuario lo autorice y el tratamiento de datos no estrictamente necesarios para la prestación del servicio.</li>
          <li><strong>Cumplimiento de obligaciones legales</strong> (art. 6.1.c RGPD): para la conservación de datos exigidos por la normativa aplicable.</li>
          <li><strong>Interés legítimo del responsable</strong> (art. 6.1.f RGPD): para garantizar la seguridad de la plataforma, prevenir el fraude y la suplantación de identidad.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">4. Conservación de los datos</h2>
        <p>
          Los datos personales se conservarán durante el tiempo estrictamente necesario para
          cumplir con la finalidad para la que se recabaron y, en todo caso, durante los plazos
          legalmente establecidos.
        </p>
        <p className="mt-3">
          En particular, los <strong>documentos de verificación</strong> se conservan
          exclusivamente mientras el usuario está en estado <em>pendiente</em>, <em>procesando</em>,
          <em>rechazado</em> o <em>pendiente de revisión manual</em>. En el momento en que el
          usuario queda <strong>verificado</strong>, el documento se <strong>elimina de forma
          automática</strong> del servicio de almacenamiento (Cloudinary) y la referencia al mismo
          se borra de la base de datos. El usuario puede, en cualquier momento, solicitar la
          eliminación del documento pendiente desde su panel de perfil.
        </p>
        <p className="mt-3">
          Los datos de la cuenta de usuario se conservan mientras el usuario no solicite su
          baja. Tras la baja, los datos se conservarán durante los plazos legalmente exigibles y,
          posteriormente, se suprimirán.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">5. Destinatarios de los datos</h2>
        <p>Los datos personales podrán ser comunicados a los siguientes encargados del tratamiento, todos ellos con contrato de encargado del tratamiento suscrito conforme al art. 28 RGPD:</p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li><strong>Cloudinary</strong> (Cloudinary.com, EE. UU.): almacenamiento de los documentos y imágenes de verificación y de pisos. <strong>Transferencia internacional a EE. UU.</strong> amparada en cláusulas contractuales tipo y medidas de salvaguardia adicionales.</li>
          <li><strong>Resend, Inc.</strong> (EE. UU.): envío de correos electrónicos transaccionales (verificación de email, notificación de revisión manual, etc.). Transferencia internacional a EE. UU. con cláusulas contractuales tipo.</li>
          <li><strong>Railway Corp.</strong> (EE. UU.): alojamiento del backend y la base de datos PostgreSQL. Transferencia internacional a EE. UU. con cláusulas contractuales tipo.</li>
          <li><strong>Vercel Inc.</strong> (EE. UU.): alojamiento del frontend. Transferencia internacional a EE. UU. con cláusulas contractuales tipo.</li>
        </ul>
        <p className="mt-3">
          No se cederán datos a terceros salvo por obligación legal. No se realizan transferencias
          internacionales a países terceros no adecuados sin las garantías previstas en el
          capítulo V del RGPD.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">6. Derechos de los interesados</h2>
        <p>El usuario tiene derecho a:</p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li><strong>Acceso</strong> a sus datos personales.</li>
          <li><strong>Rectificación</strong> de datos inexactos o incompletos.</li>
          <li><strong>Supresión</strong> ("derecho al olvido").</li>
          <li><strong>Limitación</strong> del tratamiento.</li>
          <li><strong>Oposición</strong> al tratamiento.</li>
          <li><strong>Portabilidad</strong> de los datos.</li>
          <li><strong>No ser objeto de decisiones automatizadas</strong> (la verificación OCR no constituye una decisión automatizada con efectos jurídicos sobre el usuario; en caso de rechazo o revisión manual, siempre interviene un administrador).</li>
        </ul>
        <p className="mt-3">
          Para ejercer estos derechos, el usuario puede enviar un correo electrónico a
          <a href="mailto:mundointerinodev@gmail.com" className="text-[#2F5DAA] underline"> mundointerinodev@gmail.com</a>,
          indicando el derecho que desea ejercer y acompañando copia de un documento
          identificativo.
        </p>
        <p className="mt-3">
          Asimismo, el usuario puede presentar una reclamación ante la <strong>Agencia Española
          de Protección de Datos (AEPD)</strong> a través de su sede electrónica
          (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#2F5DAA] underline">www.aepd.es</a>) si considera que se ha vulnerado alguno de sus derechos.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">7. Datos tratados</h2>
        <p>Los datos personales tratados para cada finalidad son los siguientes:</p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li><strong>Registro y cuenta:</strong> nombre, email, teléfono, contraseña (almacenada cifrada), rol (interino/propietario/administrador).</li>
          <li><strong>Verificación de interino:</strong> tipo de documento, administración (educación/sanidad/justicia/otros), documento aportado (imagen o PDF). <strong>Eliminados tras verificación.</strong></li>
          <li><strong>Anuncios de pisos:</strong> datos de contacto, ubicación, características y fotografías del inmueble.</li>
          <li><strong>Contacto:</strong> nombre, email, contenido del mensaje.</li>
          <li><strong>Logs de seguridad y auditoría:</strong> IP, fecha y hora de accesos, acciones relevantes (incluyendo el acceso del administrador a un documento de verificación en revisión manual).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">8. Medidas de seguridad</h2>
        <p>
          Mundointerino ha adoptado las medidas técnicas y organizativas necesarias para
          garantizar la seguridad de los datos personales y prevenir su alteración, pérdida,
          tratamiento o acceso no autorizado, conforme al art. 32 RGPD. Entre otras:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li>Cifrado de contraseñas mediante bcrypt.</li>
          <li>Tokens de sesión JWT en cookies httpOnly (no accesibles desde JavaScript).</li>
          <li>Acceso al panel de administración protegido por control de roles.</li>
          <li>Auditoría de acceso a documentos de verificación por parte del equipo de administración.</li>
          <li>Eliminación automática de documentos tras la verificación (principio de minimización).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">9. Origen de los datos</h2>
        <p>
          Los datos personales proceden directamente del interesado, a través del formulario de
          registro, del formulario de contacto o del formulario de subida de documentación de
          verificación.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">10. Modificación de la Política de Privacidad</h2>
        <p>
          Mundointerino se reserva el derecho de modificar la presente Política de Privacidad
          para adaptarla a las novedades legislativas o jurisprudenciales. Se recomienda al
          usuario revisarla periódicamente.
        </p>
      </section>
    </LegalLayout>
  )
}
