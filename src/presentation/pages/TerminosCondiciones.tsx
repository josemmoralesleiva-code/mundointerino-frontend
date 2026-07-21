import { Link } from 'react-router-dom'
import LegalLayout from '../components/layout/LegalLayout'

export default function TerminosCondiciones() {
  return (
    <LegalLayout
      title="Términos y Condiciones de Uso"
      subtitle="Condiciones que rigen el acceso y uso del sitio web Mundointerino."
      lastUpdated="21 de julio de 2026"
    >
      <section>
        <h2 className="text-xl font-bold mb-2">1. Objeto</h2>
        <p>
          Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web
          https://mundointerino.com (en adelante, "el sitio web"), titularidad de Mundointerino.
        </p>
        <p className="mt-3">
          El acceso al sitio web implica la aceptación plena y sin reservas de los presentes
          Términos y Condiciones. Si el usuario no está de acuerdo, deberá abstenerse de utilizar
          el sitio web.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">2. Finalidad de la plataforma</h2>
        <p>
          Mundointerino es una plataforma cuyo objetivo es facilitar a las personas interinas y
          trabajadores sustitutos de las administraciones públicas (educación, sanidad, justicia
          y otros) el acceso a alojamiento temporal en las localidades donde son destinados, así
          como a una comunidad de apoyo y a información útil para su trayectoria profesional.
        </p>
        <p className="mt-3">
          El usuario declara que se registra en la plataforma en calidad de interino, sustituto o
          persona destinataria de los servicios que Mundointerino presta, y que el uso del sitio
          web se circunscribe a la finalidad anteriormente descrita.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">3. Condiciones de registro y uso de la cuenta</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>El usuario debe proporcionar información veraz y completa en el formulario de registro y mantenerla actualizada.</li>
          <li>El usuario es responsable de mantener la confidencialidad de su contraseña y de cuantas accesos se realicen con su cuenta.</li>
          <li>El usuario se compromete a no ceder su cuenta a terceros ni a crear cuentas falsas o suplantando a otra persona.</li>
          <li>El usuario debe ser mayor de edad (18 años o más) para registrarse.</li>
          <li>El usuario acepta que la verificación documental es un requisito imprescindible para acceder a las funcionalidades de la plataforma reservadas a interinos, y que el documento aportado será utilizado <strong>exclusivamente para verificar su condición</strong> y se eliminará tras la verificación, conforme a la <Link to="/privacidad" className="text-[#2F5DAA] underline">Política de Privacidad</Link>.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">4. Obligaciones del usuario</h2>
        <p>El usuario se compromete a:</p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li>Hacer un uso lícito y conforme a las buenas costumbres del sitio web.</li>
          <li>No utilizar la plataforma con finalidades fraudulentas, ni para activities de hostigamiento, discriminación o acoso a otros usuarios.</li>
          <li>No publicar contenidos que sean ilícitos, vulneren derechos de terceros (incluidos derechos de propiedad intelectual e industrial), o que contengan material obsceno, ofensivo o dañino.</li>
          <li>No introducir virus, código malicioso o cualquier otro elemento que pueda dañar el sitio web o los sistemas de terceros.</li>
          <li>No realizar actividades de scraping, crawling o extracción masiva de datos.</li>
          <li>No suplantar a otros usuarios ni falsear la condición de interino mediante documentos apócrifos o pertenecientes a terceros.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">5. Contenidos publicados por el usuario</h2>
        <p>
          El usuario es el único responsable de los contenidos que publique en la plataforma
          (anuncios de pisos, mensajes comunitarios, datos de contacto, etc.). Al publicar, el
          usuario garantiza:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li>Que dispone de los derechos necesarios para publicar dichos contenidos.</li>
          <li>Que los contenidos son veraces y no engañosos.</li>
          <li>Que los datos de los inmuebles anunciados son exactos y que el usuario está autorizado para publicarlos.</li>
          <li>Que las fotografías son reales y corresponden al inmueble anunciado.</li>
        </ul>
        <p className="mt-3">
          Mundointerino actúa como intermediario y no interviene en la creación ni modificación
          de los contenidos de los usuarios. No obstante, se reserva el derecho de retirar
          cualquier contenido que considere ilícito o contrario a los presentes Términos, así
          como de suspender o dar de baja la cuenta de los usuarios infractores.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">6. Anuncios de pisos y relaciones entre usuarios</h2>
        <p>
          Mundointerino es un portal de intermediación que facilita el contacto entre
          propietarios e inquilinos. Mundointerino <strong>no es parte</strong> en los contratos
          de arrendamiento ni en cualquier otra relación que pueda establecerse entre los
          usuarios a través de la plataforma, y no asume responsabilidad sobre los mismos.
        </p>
        <p className="mt-3">
          Mundointerino no garantiza la veracidad, exactitud o legalidad de los anuncios
          publicados, ni se hace responsable de los daños y perjuicios que pudieran derivarse de
          las relaciones contractuales entre usuarios.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">7. Verificación documental</h2>
        <p>
          La verificación documental de la condición de interino tiene como única finalidad
          garantizar que la plataforma es utilizada por sus destinatarios legítimos. El
          documento aportado:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li>Se procesa mediante OCR local (Tesseract.js) y, en su caso, revisión manual por el equipo de administración.</li>
          <li>No se utiliza para ningún uso privado ni comercial.</li>
          <li>Se <strong>elimina automáticamente</strong> del almacenamiento Cloudinary en el momento en que el usuario queda verificado.</li>
          <li>Su tratamiento se describe con detalle en la <Link to="/privacidad" className="text-[#2F5DAA] underline">Política de Privacidad</Link>.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">8. Acceso y disponibilidad del servicio</h2>
        <p>
          Mundointerino no garantiza la continuidad y disponibilidad permanente del sitio web.
          Realizará, en la medida de lo posible, labores de mantenimiento y actualización fuera
          de los horarios de mayor uso. No se hace responsable de los daños causados por la
          interrupción del servicio o por fallos en el acceso al sitio.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">9. Limitación de responsabilidad</h2>
        <p>
          Mundointerino no será responsable de los daños directos o indirectos, lucro cesante,
          pérdida de datos o cualquier otro perjuicio derivado del uso o imposibilidad de uso del
          sitio web, ni de los contenidos publicados por los usuarios, ni de las relaciones
          contractuales entre usuarios.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">10. Propiedad intelectual</h2>
        <p>
          Los contenidos propios de Mundointerino (diseño, código, textos, gráficos, logos) están
          protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su
          reproducción, distribución o explotación sin autorización expresa por escrito.
        </p>
        <p className="mt-3">
          Los contenidos publicados por los usuarios son titularidad del usuario que los
          publica, quien autoriza a Mundointerino para su exhibición en la plataforma con la
          finalidad de prestar el servicio.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">11. Modificación de los Términos y Condiciones</h2>
        <p>
          Mundointerino se reserva el derecho de modificar los presentes Términos y Condiciones
          en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el
          sitio web. Se recomienda al usuario revisarlos periódicamente.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">12. Suspensión y baja de la cuenta</h2>
        <p>
          Mundointerino podrá suspender o dar de baja la cuenta de un usuario que incumpla los
          presentes Términos, que utilice la plataforma con finalidades fraudulentas o que
          aporte documentación apócrifa o suplantando a otra persona. El usuario puede solicitar
          la baja de su cuenta en cualquier momento enviando un correo a
          <a href="mailto:mundointerinodev@gmail.com" className="text-[#2F5DAA] underline"> mundointerinodev@gmail.com</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">13. Legislación aplicable y jurisdicción</h2>
        <p>
          Los presentes Términos y Condiciones se rigen por la legislación española. Para la
          resolución de cualquier controversia, las partes se someten a los Juzgados y
          Tribunales del domicilio del titular, salvo aplicación de la normativa de consumidores
          y usuarios.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">14. Reclamaciones y contacto</h2>
        <p>
          Para cualquier consulta o reclamación relativa a los presentes Términos, el usuario
          puede dirigirse a <a href="mailto:mundointerinodev@gmail.com" className="text-[#2F5DAA] underline">mundointerinodev@gmail.com</a>.
        </p>
      </section>
    </LegalLayout>
  )
}
