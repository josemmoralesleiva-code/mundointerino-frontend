import { Link } from 'react-router-dom'
import LegalLayout from '../components/layout/LegalLayout'

export default function AvisoLegal() {
  return (
    <LegalLayout
      title="Aviso Legal"
      subtitle="Información sobre el titular y las condiciones generales de uso del sitio web."
      lastUpdated="21 de julio de 2026"
    >
      <section>
        <h2 className="text-xl font-bold mb-2">1. Datos identificativos del titular</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la
          sociedad de la información y de comercio electrónico (LSSI-CE), se informan los datos
          identificativos del titular de este sitio web:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li><strong>Titular:</strong> Mundointerino (proyecto en fase de desarrollo; la titularidad como persona física o jurídica se determinará en el momento de su constitución formal).</li>
          <li><strong>Domicilio:</strong> A determinar.</li>
          <li><strong>NIF/CIF:</strong> A determinar.</li>
          <li><strong>Correo electrónico de contacto:</strong> <a href="mailto:mundointerinodev@gmail.com" className="text-[#2F5DAA] underline">mundointerinodev@gmail.com</a></li>
          <li><strong>Sitio web:</strong> https://mundointerino.com</li>
        </ul>
        <p className="mt-3">
          Mundointerino se reserva el derecho de actualizar los datos identificativos cuando se
          formalice la titularidad como persona física o jurídica, publicando dichos cambios en
          esta misma página.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">2. Condición de prestador de servicios de la sociedad de la información</h2>
        <p>
          En cumplimiento del artículo 14 de la LSSI-CE, Mundointerino declara que actúa como
          prestador de servicios de la sociedad de la información (intermediario) respecto de los
          contenidos alojados por los usuarios (anuncios de pisos, mensajes comunitarios, etc.).
          Mundointerino no interviene en la creación ni en la modificación de los contenidos
          suministrados por los usuarios, y aplicará medidas de expeditividad para retirar
          contenidos ilícitos cuando tenga conocimiento efectivo de su ilicitud.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">3. Condiciones generales de uso</h2>
        <p>
          El acceso y uso del sitio web atribuye la condición de usuario e implica la aceptación
          plena de las presentes condiciones y de los <Link to="/terminos" className="text-[#2F5DAA] underline">Términos y Condiciones de Uso</Link>.
        </p>
        <p>
          El usuario se compromete a utilizar el sitio web, sus contenidos y servicios de forma
          conforme a la ley, a la moral, al orden público y a las buenas costumbres, y a no
          realizar ninguna actividad que pudiera dañar, sobrecargar, deteriorar o impedir la
          normal utilización del sitio.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">4. Propiedad intelectual e industrial</h2>
        <p>
          Todos los contenidos del sitio web (incluidos, a título enunciativo, textos,
          fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño
          gráfico y códigos fuente) son propiedad intelectual e industrial de Mundointerino o de
          terceros que han autorizado su uso, sin que puedan entenderse cedidos al usuario
          ninguno de los derechos de explotación reconocidos por la normativa vigente.
        </p>
        <p>
          Los contenidos publicados por los usuarios (anuncios, mensajes, etc.) son titularidad
          del usuario que los publica, quien garantiza disponer de los derechos necesarios para
          su publicación y autoriza a Mundointerino para su exhibición en la plataforma.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">5. Responsabilidad</h2>
        <p>
          Mundointerino no se hace responsable, en ningún caso, de los daños y perjuicios de
          cualquier naturaleza que pudieran derivarse del uso o acceso al sitio web, ni de los
          contenidos publicados por los usuarios. El usuario accede al sitio web bajo su propia
          responsabilidad.
        </p>
        <p>
          Mundointerino no se responsabiliza de los posibles errores de seguridad que se puedan
          producir por la utilización de navegadores no actualizados o de la instalación en el
          terminal del usuario de versiones no aptas de software.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">6. Modificación del aviso legal</h2>
        <p>
          Mundointerino se reserva el derecho de modificar el presente Aviso Legal para adaptarlo
          a las novedades legislativas o jurisprudenciales, así como a las prácticas de la
          industria. Se recomienda al usuario revisarlo periódicamente.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">7. Legislación aplicable y jurisdicción</h2>
        <p>
          El presente Aviso Legal se rige por la legislación española. Para la resolución de
          cualquier controversia, las partes se someten a los Juzgados y Tribunales del domicilio
          del titular, salvo aplicación de la normativa de consumidores y usuarios.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">8. Reclamaciones</h2>
        <p>
          Para cualquier reclamación, el usuario puede dirigirse a
          <a href="mailto:mundointerinodev@gmail.com" className="text-[#2F5DAA] underline"> mundointerinodev@gmail.com</a>.
          Asimismo, puede presentar una reclamación ante la Agencia Española de Protección de
          Datos (AEPD) a través de su sede electrónica (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#2F5DAA] underline">www.aepd.es</a>).
        </p>
      </section>
    </LegalLayout>
  )
}
