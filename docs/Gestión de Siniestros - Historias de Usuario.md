# Gestión de Siniestros - Historias de Usuario

## **E01 — Integración con Google Workspace**

**Objetivo**
&#x20;Conectar de forma segura la aplicación con el entorno de Google Workspace de Gerencia de Riesgos para recibir y enviar correos desde el buzón corporativo de siniestros.

**Outcome esperado**
&#x20;El sistema puede escuchar correos reales y responder en nombre de la empresa sin intervención manual.

**Alcance**

* Autenticación con Google Workspace (OAuth)
* Configuración del buzón `siniestros@gerenciaderiesgos.com`
* Permisos de lectura y envío de correos
* Parámetros configurables (no hardcode)

**Fuera de alcance**

* Clasificación del contenido de los correos
* Seguridad avanzada y auditoría (ver E15)

***

### **HU-E01-01 — Autenticación segura con Google Workspace**

**Narrativa**

**Como** administradora/or del sistema
**Quiero** autenticar la aplicación contra Google Workspace usando OAuth
**Para** que pueda acceder al buzón corporativo de forma segura y controlada.

**Valor esperado**

* Tipo de valor: **habilitador / reducción de riesgo**
* Outcome: la app puede conectarse legal y técnicamente a Google Workspace.

**Reglas de negocio**

* La autenticación debe usar OAuth 2.0 de Google
* No se permiten credenciales hardcodeadas
* El acceso debe ser revocable

**Criterios de aceptación**

* La app puede iniciar el flujo OAuth
* Se solicitan únicamente los permisos necesarios
* El token se guarda de forma segura
* El token puede renovarse automáticamente

**Gherkin**

```
Scenario: Autenticación exitosa con Google Workspace Given que el administrador inicia la configuración When autoriza el acceso a Google Workspace Then la aplicación obtiene un token válido And puede acceder a la API de Gmail 
```

**Ejemplos**

| Parámetro | Valor                      |
| --------- | -------------------------- |
| Scope     | gmail.readonly, gmail.send |
| Cuenta    |                            |

**No funcionales**

* Tokens cifrados en reposo
* Cumplimiento OAuth de Google

**Definition of Done**

* Autenticación funciona en entorno real
* Token renovable probado
* Documentación básica disponible

***

### **HU-E01-02 — Configurar el buzón corporativo de siniestros**

** Narrativa**

**Como** administradora/or
**Quiero** configurar qué buzón de Google Workspace escucha la aplicación
**Para** asegurar que solo se procesan correos corporativos válidos.

**Valor esperado**

* Tipo de valor: **control corporativo**
* Outcome: el sistema actúa solo sobre el buzón correcto.

**Reglas de negocio**

* Solo se permiten correos del dominio corporativo
* El buzón debe ser configurable (no fijo en código)

**Criterios de aceptación**

* Se puede definir el correo `siniestros@gerenciaderiesgos.com`
* La app valida que el buzón existe
* El buzón puede cambiarse sin redeploy

**Gherkin**

```
Scenario: Configuración del buzón de siniestros Given que el administrador accede al backoffice When configura el buzón siniestros@gerenciaderiesgos.com Then la aplicación escucha ese buzón And ignora otros buzones 
```

**Ejemplos**

* Buzón válido: `siniestros@gerenciaderiesgos.com`
* Buzón inválido: `gmailpersonal@gmail.com`

**DoD**

* Configuración persistida
* Validaciones activas
* Cambio dinámico probado

***

### **HU-E01-03 — Configurar permisos mínimos de acceso a correo**

** Narrativa**

**Como** responsable de seguridad
**Quiero** que la aplicación tenga permisos mínimos sobre Gmail
**Para** reducir riesgos legales y operativos.

**Valor esperado**

* Tipo de valor: **seguridad**
* Outcome: menor superficie de ataque.

**Reglas de negocio**

* Principio de mínimo privilegio
* Solo lectura y envío de correos

**Criterios de aceptación**

* No se solicitan permisos innecesarios
* La app no puede borrar correos
* La app no puede acceder a Drive ni Calendar

**Gherkin**

```
Scenario: Permisos mínimos configurados Given que la app solicita permisos a Google Then solo solicita lectura y envío de correos And no solicita permisos adicionales 
```

**DoD**

* Scopes revisados
* Aprobación de seguridad

***

### **HU-E01-04 — Escuchar correos entrantes del buzón configurado**

** Narrativa**

**Como** sistema
**Quiero** detectar nuevos correos entrantes en el buzón configurado
**Para** iniciar el flujo automático de siniestros.

**Valor esperado**

* Tipo de valor: **automatización**
* Outcome: no es necesario revisar el correo manualmente.

**Reglas de negocio**

* Solo correos nuevos
* No reprocesar correos ya leídos

**Criterios de aceptación**

* El sistema detecta correos nuevos
* Marca correos procesados
* No duplica procesamiento

**Gherkin**

```
Scenario: Detección de nuevo correo Given que llega un correo nuevo al buzón When el sistema sincroniza Then detecta el correo And lo marca como procesado 
```

**Ejemplos**

* Frecuencia: cada X minutos
* Estado: nuevo / procesado

**DoD**

* Listener activo
* Detección validada con correos reales

***

### **HU-E01-05 — Enviar correos desde el buzón corporativo**

** Narrativa**

**Como** sistema
**Quiero** enviar correos desde `siniestros@gerenciaderiesgos.com`
**Para** comunicarme con clientes de forma corporativa.

**Valor esperado**

* Tipo de valor: **confianza / imagen**
* Outcome: el cliente reconoce a Gerencia de Riesgos como emisor.

**Reglas de negocio**

* El remitente siempre es el correo corporativo
* No se permite suplantación

**Criterios de aceptación**

* El correo sale desde el buzón configurado
* El destinatario recibe el correo correctamente
* El asunto y cuerpo se envían sin alteraciones

**Gherkin**

```
Scenario: Envío de correo corporativo Given que el sistema debe responder a un cliente When envía el correo Then el remitente es siniestros@gerenciaderiesgos.com And el cliente recibe el mensaje 
```

**DoD**

* Envío probado
* Logs de envío disponibles

***

### **HU-E01-06 — Manejo de errores de conexión con Google Workspace**

** Narrativa**

**Como** sistema
**Quiero** detectar y reportar errores de conexión con Google Workspace
**Para** que el equipo actúe a tiempo.

**Valor esperado**

* Tipo de valor: **resiliencia**
* Outcome: ningún fallo pasa desapercibido.

**Reglas de negocio**

* Errores críticos deben notificarse
* El sistema no debe “quedarse en silencio”

**Criterios de aceptación**

* Error detectado
* Registro del error
* Notificación interna enviada

**Gherkin**

```
Scenario: Error de conexión con Google Given que falla la conexión a Google Workspace When el sistema intenta sincronizar Then registra el error And notifica al equipo de siniestros 
```

**DoD**

* Gestión de errores implementada
* Alertas funcionando

***

## **E02 — Ingesta y detección de correos de siniestros**

**Objetivo**
&#x20;Detectar automáticamente correos entrantes relevantes relacionados con siniestros vehiculares.

**Outcome esperado**
&#x20;El sistema identifica correctamente cuándo “empieza un siniestro” sin depender de personas.

**Alcance**

* Escucha continua del buzón
* Filtros por remitente, asunto y contenido
* Detección de correos procesables vs no procesables

**Fuera de alcance**

* Interpretación del contenido del correo
* Respuestas automáticas

***

### HU-E02-01 — Detección de correos entrantes nuevos

** Narrativa**

**Como** sistema
**Quiero** detectar correos nuevos que llegan al buzón configurado
**Para** iniciar el procesamiento automático de siniestros.

**Valor esperado**

* Tipo de valor: **automatización / eficiencia operativa**
* Outcome: el sistema reacciona en tiempo cercano a real ante nuevos correos.

**Reglas de negocio**

* Solo se consideran correos **no procesados previamente**
* No se deben reprocesar correos antiguos

**Criterios de aceptación**

* El sistema detecta correos nuevos
* Cada correo detectado se marca con un identificador único
* Un correo no se procesa más de una vez

**Gherkin**

```
Scenario: Detección de un correo nuevo Given que existe un correo nuevo en el buzón de siniestros When el sistema ejecuta el proceso de ingesta Then el correo es detectado And se marca como pendiente de análisis 
```

**Definition of Done**

* Detección probada con correos reales
* No se generan duplicados
* Estado persistido correctamente

***

### HU-E02-02 — Filtrado de correos no relevantes

** Narrativa**

**Como** sistema
**Quiero** descartar correos que no estén relacionados con siniestros
**Para** evitar ruido y falsos positivos.

**Valor esperado**

* Tipo de valor: **reducción de desperdicio**
* Outcome: solo se procesan correos que aportan valor.

**Reglas de negocio**

* Se excluyen:
  * newsletters
  * firmas automáticas
  * respuestas internas
* El filtro debe ser configurable

**Criterios de aceptación**

* El sistema clasifica un correo como relevante o no relevante
* Los correos no relevantes no continúan el flujo
* El criterio puede ajustarse sin tocar código

**Gherkin**

```
Scenario: Correo no relevante Given que llega un correo promocional al buzón When el sistema lo analiza Then lo clasifica como no relevante And no inicia el flujo de siniestro 
```

**Definition of Done**

* Reglas de filtrado configurables
* Pruebas con correos reales no relacionados con siniestros

***

### HU-E02-03 — Identificación de correos de aseguradoras

** Narrativa**

**Como** sistema
**Quiero** identificar si un correo proviene de una aseguradora
**Para** aumentar la probabilidad de que sea un aviso de siniestro.

**Valor esperado**

* Tipo de valor: **precisión**
* Outcome: menos falsos positivos y negativos.

**Reglas de negocio**

* Se consideran dominios y remitentes conocidos
* La lista de aseguradoras debe ser configurable

**Criterios de aceptación**

* El sistema reconoce correos de aseguradoras conocidas
* El correo queda marcado como “posible siniestro”
* Se puede añadir una nueva aseguradora sin desarrollo

**Gherkin**

```
Scenario: Correo de aseguradora conocida Given que llega un correo desde rimac.com.pe When el sistema evalúa el remitente Then identifica que proviene de una aseguradora And lo marca como potencial aviso de siniestro 
```

**Definition of Done**

* Lista de dominios configurable
* Clasificación persistida

***

### HU-E02-04 — Detección de palabras clave de siniestro

** Narrativa**

**Como** sistema
**Quiero** analizar el asunto y cuerpo del correo buscando palabras clave
**Para** identificar avisos de siniestro aunque el remitente no sea concluyente.

**Valor esperado**

* Tipo de valor: **cobertura**
* Outcome: se detectan siniestros incluso en correos atípicos.

**Reglas de negocio**

* Palabras clave configurables (ej. “aviso de siniestro”, “choque”, “cobertura”)
* El idioma principal es español

**Criterios de aceptación**

* El sistema detecta coincidencias relevantes
* Se asigna un nivel de confianza al correo
* Las palabras clave pueden modificarse

**Gherkin**

```
Scenario: Correo con palabras clave de siniestro Given que un correo contiene la frase "aviso de siniestro" When el sistema analiza el contenido Then incrementa el nivel de confianza del correo And lo considera relevante 
```

**Definition of Done**

* Motor de palabras clave operativo
* Configuración editable

***

### HU-E02-05 — Clasificación preliminar del correo como siniestro

** Narrativa**

**Como** sistema
**Quiero** clasificar preliminarmente un correo como “aviso de siniestro”
**Para** enviarlo al siguiente paso del flujo.

**Valor esperado**

* Tipo de valor: **flujo**
* Outcome: el correo entra correctamente al pipeline de siniestros.

**Reglas de negocio**

* La clasificación se basa en:
  * remitente
  * palabras clave
  * reglas configuradas
* La decisión debe ser trazable

**Criterios de aceptación**

* El sistema asigna una categoría preliminar
* Se guarda el motivo de la clasificación
* El correo queda listo para la EPIC E03

**Gherkin**

```
Scenario: Clasificación preliminar como siniestro Given que un correo cumple criterios de siniestro When el sistema evalúa las reglas Then lo clasifica como aviso de siniestro And registra las razones de la decisión 
```

**Definition of Done**

* Clasificación persistida
* Evidencia de decisión registrada

***

### HU-E02-06 — Registro de correos descartados

** Narrativa**

**Como** equipo de siniestros
**Quiero** que los correos descartados queden registrados
**Para** auditar y mejorar las reglas de detección.

**Valor esperado**

* Tipo de valor: **aprendizaje / mejora continua**
* Outcome: el sistema se vuelve más fiable con el tiempo.

**Reglas de negocio**

* Los correos descartados no activan flujos
* El registro debe ser consultable

**Criterios de aceptación**

* Cada correo descartado queda registrado
* Se almacena el motivo del descarte
* El equipo puede revisarlos posteriormente

**Gherkin**

```
Scenario: Registro de correo descartado Given que un correo no cumple criterios de siniestro When el sistema lo descarta Then registra el correo And guarda el motivo del descarte 
```

**Definition of Done**

* Registro accesible
* Motivos claros y trazables

***

## **E03 — Clasificación inteligente del tipo de correo**

**Objetivo**
&#x20;Determinar qué tipo de evento representa cada correo recibido.

**Outcome esperado**
&#x20;Cada correo se entiende dentro de un flujo de siniestro (inicio, aprobación, informativo).

**Alcance**

* Clasificación en:
  * aviso de siniestro
  * aprobación de cobertura
  * otros informativos
* Uso de reglas + IA

**Fuera de alcance**

* Extracción detallada de datos
* Comunicación al cliente

***

### HU-E03-01 — Definir los tipos de correo del flujo de siniestros

** Narrativa**

**Como** Product Manager / equipo de negocio
**Quiero** definir los tipos de correos que existen en el flujo de siniestros
**Para** que el sistema clasifique correctamente los eventos.

**Valor esperado**

* Tipo de valor: **claridad operativa**
* Outcome: el flujo de siniestros tiene un lenguaje común y explícito.

**Reglas de negocio**

* Tipos mínimos para el MVP:
  * Aviso inicial de siniestro
  * Aprobación de cobertura
  * Correo informativo relacionado
* Los tipos deben ser extensibles

**Criterios de aceptación**

* Existe un catálogo de tipos de correo
* Cada tipo tiene una descripción clara
* Se pueden añadir nuevos tipos sin desarrollo

**Gherkin**

```
Scenario: Definición de tipos de correo Given que el sistema tiene configurado el catálogo de tipos Then existen al menos los tipos "aviso de siniestro" y "aprobación de cobertura" 
```

**Definition of Done**

* Catálogo persistido
* Tipos visibles en configuración

***

### HU-E03-02 — Clasificar correos como aviso inicial de siniestro

** Narrativa**

**Como** sistema
**Quiero** identificar cuándo un correo corresponde a un aviso inicial de siniestro
**Para** iniciar la comunicación con el cliente.

**Valor esperado**

* Tipo de valor: **activación**
* Outcome: el cliente recibe confirmación rápida de su siniestro.

**Reglas de negocio**

* Se basa en:
  * remitente (aseguradora)
  * palabras clave
  * estructura del correo
* La decisión debe ser explicable

**Criterios de aceptación**

* El correo queda clasificado como “aviso de siniestro”
* Se guarda el motivo de la clasificación
* El correo pasa a la EPIC de extracción de datos

**Gherkin**

```
Scenario: Clasificación como aviso de siniestro Given que un correo cumple criterios de aviso inicial When el sistema lo analiza Then lo clasifica como aviso de siniestro And registra la razón de la clasificación 
```

**Definition of Done**

* Clasificación correcta en pruebas reales
* Evidencia de decisión almacenada

***

### HU-E03-03 — Clasificar correos como aprobación de cobertura

** Narrativa**

**Como** sistema
**Quiero** identificar correos que informan la aprobación de cobertura
**Para** notificar correctamente al cliente.

**Valor esperado**

* Tipo de valor: **confianza / continuidad**
* Outcome: el cliente sabe que su cobertura fue aprobada.

**Reglas de negocio**

* Palabras clave y frases típicas por aseguradora
* El correo debe asociarse a un siniestro existente

**Criterios de aceptación**

* El sistema reconoce correos de aprobación
* El correo se asocia a un siniestro previo
* Se evita clasificar aprobaciones como avisos nuevos

**Gherkin**

```
Scenario: Clasificación como aprobación de cobertura Given que llega un correo con confirmación de cobertura And existe un siniestro previo registrado When el sistema lo analiza Then lo clasifica como aprobación de cobertura 
```

**Definition of Done**

* Asociación correcta con siniestros existentes
* Clasificación validada con varios formatos

***

### HU-E03-04 — Clasificar correos como informativos relacionados

** Narrativa**

**Como** sistema
**Quiero** clasificar correos que no inician ni avanzan el flujo principal
**Para** mantener trazabilidad sin disparar acciones incorrectas.

**Valor esperado**

* Tipo de valor: **control**
* Outcome: el sistema no reacciona de más.

**Reglas de negocio**

* No generan respuesta automática al cliente
* Quedan asociados al siniestro si aplica

**Criterios de aceptación**

* El correo queda marcado como “informativo”
* No se envía comunicación automática
* El correo queda registrado

**Gherkin**

```
Scenario: Clasificación como correo informativo Given que un correo no es aviso ni aprobación When el sistema lo evalúa Then lo clasifica como informativo And no dispara ninguna respuesta 
```

**Definition of Done**

* Correos informativos visibles en el historial
* Ninguna acción automática ejecutada

***

### HU-E03-05 — Resolver ambigüedad en la clasificación

** Narrativa**

**Como** sistema
**Quiero** detectar correos cuya clasificación no es clara
**Para** evitar errores automáticos.

**Valor esperado**

* Tipo de valor: **reducción de riesgo**
* Outcome: menos comunicaciones incorrectas al cliente.

**Reglas de negocio**

* Si la confianza es baja:
  * no se responde automáticamente
  * se marca como “requiere revisión”

**Criterios de aceptación**

* El sistema detecta baja confianza
* El correo queda en estado “pendiente”
* Se notifica internamente

**Gherkin**

```
Scenario: Correo con clasificación ambigua Given que un correo no cumple reglas claras When el sistema lo clasifica Then lo marca como pendiente de revisión And no envía respuesta automática 
```

**Definition of Done**

* Umbral de confianza configurable
* Flujo de seguridad probado

***

### HU-E03-06 — Registrar la decisión de clasificación

** Narrativa**

**Como** equipo de siniestros
**Quiero** saber por qué el sistema clasificó un correo de una forma
**Para** confiar y mejorar el modelo.

**Valor esperado**

* Tipo de valor: **transparencia**
* Outcome: confianza humana en la IA.

**Reglas de negocio**

* Cada clasificación debe ser explicable
* El motivo debe ser visible en el backoffice

**Criterios de aceptación**

* Se registra el tipo asignado
* Se registran las reglas/pistas usadas
* El equipo puede consultarlo

**Gherkin**

```
Scenario: Registro de la decisión de clasificación Given que un correo ha sido clasificado Then el sistema guarda el tipo asignado And las razones de la decisión 
```

**Definition of Done**

* Registro persistido
* Información visible para el equipo

***

## **E04 — Extracción de datos clave desde correos**

**Objetivo**
&#x20;Extraer información estructurada desde correos no estructurados.

**Outcome esperado**
&#x20;Los datos críticos del siniestro están disponibles sin intervención humana.

**Alcance**

* Extracción de:
  * número de póliza
  * placa
  * aseguradora
  * tipo de evento
* Manejo de formatos variables

**Fuera de alcance**

* Consulta a bases externas
* Validación de datos contra sistemas legacy

***

### HU-E04-01 — Definir el modelo de datos del siniestro

** Narrativa**

**Como** Product Manager / equipo de negocio
**Quiero** definir un modelo de datos estándar para siniestros
**Para** que toda la extracción sea consistente y reutilizable.

**Valor esperado**

* Tipo de valor: **claridad / estandarización**
* Outcome: todos los correos “hablan el mismo idioma” dentro del sistema.

**Reglas de negocio**

* Campos mínimos MVP:
  * número de póliza
  * placa del vehículo
  * aseguradora
  * tipo de evento
  * fecha/hora del aviso
* El modelo debe ser extensible

**Criterios de aceptación**

* Existe un esquema de datos definido
* Los campos tienen descripción y obligatoriedad
* El esquema es versionable

**Gherkin**

```
Scenario: Modelo de datos definido Given que el sistema necesita extraer datos de un correo Then existe un modelo estándar de siniestro And todos los datos extraídos se ajustan a ese modelo 
```

**Definition of Done**

* Modelo persistido
* Documentación visible para el equipo

***

### HU-E04-02 — Extraer número de póliza desde el correo

** Narrativa**

**Como** sistema
**Quiero** extraer el número de póliza desde el contenido del correo
**Para** poder identificar al asegurado.

**Valor esperado**

* Tipo de valor: **resolución**
* Outcome: el sistema puede buscar al cliente correcto.

**Reglas de negocio**

* El número de póliza puede aparecer:
  * en el cuerpo
  * en el asunto
  * en formatos distintos por aseguradora
* Si no se encuentra, se marca como dato faltante

**Criterios de aceptación**

* El sistema detecta el número de póliza cuando existe
* El valor se normaliza
* Se registra si no se pudo extraer

**Gherkin**

```
Scenario: Extracción del número de póliza Given que un correo contiene el número de póliza When el sistema analiza el contenido Then extrae el número de póliza And lo guarda en el modelo de siniestro 
```

**Definition of Done**

* Extracción probada con múltiples formatos
* Registro de errores activo

***

### HU-E04-03 — Extraer placa del vehículo

** Narrativa**

**Como** sistema
**Quiero** extraer la placa del vehículo desde el correo
**Para** usarla como clave alternativa de identificación.

**Valor esperado**

* Tipo de valor: **fallback / continuidad**
* Outcome: el flujo continúa incluso si falta la póliza.

**Reglas de negocio**

* La placa puede tener distintos formatos
* Debe normalizarse (mayúsculas, sin espacios)

**Criterios de aceptación**

* El sistema detecta la placa correctamente
* La placa se normaliza
* Se indica si el dato no está presente

**Gherkin**

```
Scenario: Extracción de placa del vehículo Given que un correo incluye la placa del vehículo When el sistema procesa el contenido Then extrae la placa And la normaliza correctamente 
```

**Definition of Done**

* Normalización validada
* Extracción consistente

***

### HU-E04-04 — Extraer aseguradora emisora del aviso

** Narrativa**

**Como** sistema
**Quiero** identificar la aseguradora que envía el correo
**Para** aplicar reglas y formatos correctos.

**Valor esperado**

* Tipo de valor: **precisión**
* Outcome: se usan las reglas adecuadas por aseguradora.

**Reglas de negocio**

* Se identifica por:
  * dominio del remitente
  * contenido del correo
* Debe coincidir con catálogo de aseguradoras

**Criterios de aceptación**

* El sistema asigna una aseguradora conocida
* Si no coincide, se marca como “desconocida”

**Gherkin**

```
Scenario: Identificación de la aseguradora Given que llega un correo desde una aseguradora conocida When el sistema lo analiza Then identifica correctamente la aseguradora emisora 
```

**Definition of Done**

* Catálogo consultado correctamente
* Casos desconocidos gestionados

***

### HU-E04-05 — Extraer fecha y hora del evento

** Narrativa**

**Como** sistema
**Quiero** extraer la fecha y hora del aviso o del evento
**Para** mantener trazabilidad temporal del siniestro.

**Valor esperado**

* Tipo de valor: **trazabilidad**
* Outcome: se puede ordenar y auditar el flujo del siniestro.

**Reglas de negocio**

* Prioridad:
  1. fecha explícita del evento
  2. fecha del correo
* Zona horaria consistente

**Criterios de aceptación**

* El sistema asigna fecha/hora válida
* Se indica el origen del dato (correo / contenido)

**Gherkin**

```
Scenario: Extracción de fecha y hora Given que un correo contiene fecha del evento When el sistema analiza el contenido Then extrae la fecha y hora del siniestro 
```

**Definition of Done**

* Fechas normalizadas
* Zona horaria definida

***

### HU-E04-06 — Validar consistencia de datos extraídos

** Narrativa**

**Como** sistema
**Quiero** validar que los datos extraídos son coherentes
**Para** evitar errores aguas abajo.

**Valor esperado**

* Tipo de valor: **reducción de riesgo**
* Outcome: menos fallos en consultas y comunicaciones.

**Reglas de negocio**

* Campos obligatorios mínimos definidos
* Si faltan datos críticos, se marca el siniestro como incompleto

**Criterios de aceptación**

* El sistema valida presencia y formato
* Se marca el estado del siniestro (completo / incompleto)
* Se registra el motivo

**Gherkin**

```
Scenario: Validación de datos incompletos Given que faltan datos críticos en la extracción When el sistema valida el modelo Then marca el siniestro como incompleto And registra el motivo 
```

**Definition of Done**

* Validaciones activas
* Estados persistidos

***

### HU-E04-07 — Registrar el resultado de la extracción

** Narrativa**

**Como** equipo de siniestros
**Quiero** ver qué datos fueron extraídos y con qué confianza
**Para** confiar en el sistema y mejorarlo.

**Valor esperado**

* Tipo de valor: **transparencia**
* Outcome: confianza humana en la IA.

**Reglas de negocio**

* Cada campo debe tener:
  * valor
  * origen
  * nivel de confianza

**Criterios de aceptación**

* Los datos extraídos quedan registrados
* La información es visible en el backoffice

**Gherkin**

```
Scenario: Registro de datos extraídos Given que el sistema ha extraído datos de un correo Then guarda los valores extraídos And registra su origen y confianza 
```

**Definition of Done**

* Registro consultable
* Datos trazables

***

## **E05 — Gestión de formatos por aseguradora**

**Objetivo**
&#x20;Permitir que la IA entienda los distintos formatos de correos enviados por aseguradoras.

**Outcome esperado**
&#x20;El sistema es extensible a nuevas aseguradoras sin desarrollo.

**Alcance**

* Configuración de formatos por aseguradora
* Asociación formato → campos
* Versionado de formatos

**Fuera de alcance**

* Gestión de plantillas de respuesta

***

### HU-E05-01 — Definir el catálogo de aseguradoras

** Narrativa**

**Como** equipo de negocio / administración
**Quiero** definir un catálogo de aseguradoras
**Para** asociar correos y formatos a cada una de ellas.

**Valor esperado**

* Tipo de valor: **organización / escalabilidad**
* Outcome: el sistema sabe “quién es quién” en los correos entrantes.

**Reglas de negocio**

* Cada aseguradora debe tener:
  * nombre
  * identificador interno
  * dominios de correo asociados
* El catálogo debe ser editable

**Criterios de aceptación**

* Se puede crear una aseguradora
* Se pueden editar sus datos
* El sistema consulta el catálogo en tiempo de ejecución

**Gherkin**

```
Scenario: Creación de una aseguradora Given que el administrador accede al backoffice When crea una nueva aseguradora Then la aseguradora queda disponible en el catálogo 
```

**Definition of Done**

* Catálogo persistido
* CRUD funcional desde backoffice

***

### HU-E05-02 — Asociar dominios y remitentes a una aseguradora

** Narrativa**

**Como** sistema
**Quiero** asociar dominios y correos remitentes a una aseguradora
**Para** identificar correctamente el origen del correo.

**Valor esperado**

* Tipo de valor: **precisión**
* Outcome: menos errores en identificación de aseguradora.

**Reglas de negocio**

* Una aseguradora puede tener múltiples dominios
* Un dominio no puede pertenecer a dos aseguradoras

**Criterios de aceptación**

* El sistema identifica la aseguradora por dominio
* Se permite configurar múltiples remitentes
* Conflictos de dominio son detectados

**Gherkin**

```
Scenario: Identificación de aseguradora por dominio Given que llega un correo desde @rimac.com.pe When el sistema analiza el remitente Then identifica la aseguradora Rimac 
```

**Definition of Done**

* Reglas de dominio activas
* Validaciones implementadas

***

### HU-E05-03 — Definir formatos de correo por aseguradora

** Narrativa**

**Como** equipo de negocio
**Quiero** definir formatos de correo específicos por aseguradora
**Para** que el sistema sepa cómo interpretar cada uno.

**Valor esperado**

* Tipo de valor: **robustez**
* Outcome: la IA entiende correos heterogéneos.

**Reglas de negocio**

* Un formato define:
  * estructura esperada
  * campos relevantes
* Una aseguradora puede tener múltiples formatos

**Criterios de aceptación**

* Se puede crear un formato por aseguradora
* Los formatos pueden activarse/desactivarse
* El sistema selecciona el formato correcto

**Gherkin**

```
Scenario: Definición de formato por aseguradora Given que una aseguradora tiene un formato definido When llega un correo de esa aseguradora Then el sistema aplica el formato correspondiente 
```

**Definition of Done**

* Formatos configurables
* Asociación correcta aseguradora–formato

***

### HU-E05-04 — Mapear campos del correo a campos del modelo de siniestro

** Narrativa**

**Como** sistema
**Quiero** mapear campos del correo a campos del modelo de siniestro
**Para** extraer los datos correctos según el formato.

**Valor esperado**

* Tipo de valor: **flexibilidad**
* Outcome: cambios de formato no rompen el flujo.

**Reglas de negocio**

* El mapeo debe ser explícito
* Un campo del modelo puede tener múltiples fuentes

**Criterios de aceptación**

* Se puede definir el origen de cada campo
* El sistema usa el mapeo en la extracción
* Se soportan expresiones / patrones básicos

**Gherkin**

```
Scenario: Mapeo de campo desde formato Given un formato con mapeo definido When el sistema extrae datos Then asigna correctamente los valores al modelo 
```

**Definition of Done**

* Mapeos persistidos
* Extracción usando mapeos

***

### HU-E05-05 — Versionar formatos de aseguradora

** Narrativa**

**Como** equipo de negocio
**Quiero** versionar los formatos de correos
**Para** adaptarme a cambios de las aseguradoras sin perder histórico.

**Valor esperado**

* Tipo de valor: **resiliencia**
* Outcome: cambios externos no rompen el sistema.

**Reglas de negocio**

* Solo una versión activa por formato
* Versiones antiguas deben conservarse

**Criterios de aceptación**

* Se puede crear una nueva versión
* Se puede activar/desactivar versiones
* Correos antiguos usan la versión correcta

**Gherkin**

```
Scenario: Versionado de formato Given que una aseguradora cambia su formato When se crea una nueva versión Then el sistema usa la versión activa 
```

**Definition of Done**

* Versionado funcional
* Historial accesible

***

### HU-E05-06 — Detectar formatos no reconocidos

** Narrativa**

**Como** sistema
**Quiero** detectar correos cuyo formato no reconozco
**Para** evitar errores silenciosos.

**Valor esperado**

* Tipo de valor: **reducción de riesgo**
* Outcome: el sistema falla de forma controlada.

**Reglas de negocio**

* Si no hay formato aplicable:
  * no se extraen datos
  * se notifica internamente

**Criterios de aceptación**

* El correo queda marcado como “formato desconocido”
* No se continúa el flujo automático
* Se genera alerta interna

**Gherkin**

```
Scenario: Formato no reconocido Given que llega un correo de una aseguradora conocida And no coincide con ningún formato activo When el sistema lo analiza Then marca el correo como formato desconocido 
```

**Definition of Done**

* Detección implementada
* Alertas funcionando

***

### HU-E05-07 — Visualizar y mantener formatos desde el backoffice

** Narrativa**

**Como** equipo de siniestros
**Quiero** visualizar y mantener los formatos configurados
**Para** ajustar el sistema sin depender de desarrollo.

**Valor esperado**

* Tipo de valor: **autonomía**
* Outcome: el equipo puede reaccionar rápido ante cambios reales.

**Reglas de negocio**

* Acceso restringido a roles autorizados
* Cambios auditables

**Criterios de aceptación**

* Los formatos son visibles y editables
* Se registra quién y cuándo hizo cambios

**Gherkin**

```
Scenario: Edición de formato desde backoffice Given que el usuario autorizado edita un formato When guarda los cambios Then el sistema aplica la nueva configuración 
```

**Definition of Done**

* Backoffice operativo
* Auditoría básica activa

***

## **E06 — Consulta de datos del asegurado**

**Objetivo**
&#x20;Obtener el correo del cliente correcto para poder comunicarse con él.

**Outcome esperado**
&#x20;La IA puede contactar al asegurado sin que una persona busque manualmente.

**Alcance**

* Búsqueda por:
  * número de póliza
  * placa (fallback)
* Prioridad y orden de búsqueda

**Fuera de alcance**

* Mantenimiento de la base de datos

***

### HU-E06-01 — Definir las claves de búsqueda del asegurado

** Narrativa**

**Como** sistema
**Quiero** definir las claves válidas para buscar a un asegurado
**Para** aplicar un orden claro y consistente de consulta.

**Valor esperado**

* Tipo de valor: **claridad operativa**
* Outcome: el sistema sabe cómo intentar identificar a un cliente.

**Reglas de negocio**

* Claves disponibles:
  * número de póliza (prioritaria)
  * placa del vehículo (fallback)
* El orden de búsqueda debe ser configurable

**Criterios de aceptación**

* El sistema conoce las claves disponibles
* Existe un orden de prioridad definido
* El orden puede modificarse sin desarrollo

**Gherkin**

```
Scenario: Definición del orden de búsqueda Given que el sistema necesita identificar a un asegurado Then primero busca por número de póliza And si no encuentra resultado busca por placa 
```

**Definition of Done**

* Orden persistido
* Configuración editable

***

### HU-E06-02 — Consultar asegurado por número de póliza

** Narrativa**

**Como** sistema
**Quiero** buscar al asegurado usando el número de póliza
**Para** obtener sus datos de contacto de forma directa.

**Valor esperado**

* Tipo de valor: **precisión**
* Outcome: alta tasa de acierto en la identificación del cliente.

**Reglas de negocio**

* El número de póliza debe coincidir exactamente
* Si hay múltiples resultados, se marca como ambiguo

**Criterios de aceptación**

* El sistema encuentra al asegurado cuando existe
* Se recupera el correo electrónico
* Se detectan casos ambiguos

**Gherkin**

```
Scenario: Búsqueda por número de póliza exitosa Given un siniestro con número de póliza válido When el sistema consulta la base de datos Then obtiene los datos del asegurado 
```

**Definition of Done**

* Consulta funcional
* Manejo de ambigüedad implementado

***

### HU-E06-03 — Consultar asegurado por placa del vehículo

** Narrativa**

**Como** sistema
**Quiero** buscar al asegurado usando la placa del vehículo
**Para** identificar al cliente cuando no hay póliza disponible.

**Valor esperado**

* Tipo de valor: **resiliencia**
* Outcome: el flujo continúa incluso con datos incompletos.

**Reglas de negocio**

* La placa debe estar normalizada
* Puede haber más de una póliza histórica por placa

**Criterios de aceptación**

* El sistema encuentra asegurados asociados a la placa
* Si hay múltiples resultados, se marca como ambiguo
* Se registra el método usado

**Gherkin**

```
Scenario: Búsqueda por placa como fallback Given un siniestro sin número de póliza And con placa válida When el sistema consulta por placa Then obtiene los posibles asegurados 
```

**Definition of Done**

* Fallback operativo
* Registro del método de búsqueda

***

### HU-E06-04 — Resolver coincidencias múltiples o ambiguas

** Narrativa**

**Como** sistema
**Quiero** detectar búsquedas con múltiples coincidencias
**Para** evitar contactar al cliente incorrecto.

**Valor esperado**

* Tipo de valor: **reducción de riesgo**
* Outcome: se evitan errores reputacionales.

**Reglas de negocio**

* Si hay más de un resultado:
  * no se responde automáticamente
  * se marca como “requiere revisión”

**Criterios de aceptación**

* El sistema detecta ambigüedad
* El flujo automático se detiene
* Se genera notificación interna

**Gherkin**

```
Scenario: Resultado ambiguo en la búsqueda Given que una búsqueda devuelve múltiples asegurados When el sistema evalúa el resultado Then marca el siniestro como ambiguo And no envía comunicación automática 
```

**Definition of Done**

* Estados de ambigüedad definidos
* Notificaciones activas

***

### HU-E06-05 — Manejar casos sin datos de asegurado

** Narrativa**

**Como** sistema
**Quiero** detectar cuando no encuentro datos del asegurado
**Para** informar al equipo y no fallar en silencio.

**Valor esperado**

* Tipo de valor: **control**
* Outcome: ningún caso se pierde por falta de datos.

**Reglas de negocio**

* Si no hay resultados:
  * no se envía correo al cliente
  * se notifica al equipo de siniestros

**Criterios de aceptación**

* El sistema identifica “asegurado no encontrado”
* Se registra el motivo
* Se notifica internamente

**Gherkin**

```
Scenario: Asegurado no encontrado Given que no existe coincidencia por póliza ni placa When el sistema finaliza la búsqueda Then marca el siniestro como asegurado no encontrado And notifica al equipo 
```

**Definition of Done**

* Estado gestionado
* Alertas enviadas

***

### HU-E06-06 — Recuperar datos mínimos de contacto del asegurado

** Narrativa**

**Como** sistema
**Quiero** recuperar los datos mínimos de contacto del asegurado
**Para** poder iniciar la comunicación automática.

**Valor esperado**

* Tipo de valor: **activación**
* Outcome: el cliente puede ser contactado correctamente.

**Reglas de negocio**

* Datos mínimos:
  * correo electrónico
* Datos opcionales:
  * nombre
  * género (si existe)

**Criterios de aceptación**

* El sistema obtiene el correo electrónico
* Los datos quedan asociados al siniestro
* Se registra la fuente del dato

**Gherkin**

```
Scenario: Recuperación de datos de contacto Given que el asegurado fue identificado When el sistema recupera sus datos Then obtiene al menos el correo electrónico 
```

**Definition of Done**

* Datos disponibles para la siguiente épica
* Asociación persistida

***

### HU-E06-07 — Registrar el resultado de la consulta del asegurado

** Narrativa**

**Como** equipo de siniestros
**Quiero** ver el resultado de la búsqueda del asegurado
**Para** entender qué hizo el sistema y por qué.

**Valor esperado**

* Tipo de valor: **transparencia**
* Outcome: confianza operativa en la IA.

**Reglas de negocio**

* Debe registrarse:
  * clave usada
  * resultado
  * estado final

**Criterios de aceptación**

* El resultado queda registrado
* Es visible desde el backoffice

**Gherkin**

```
Scenario: Registro de consulta del asegurado Given que el sistema realizó una búsqueda Then guarda la clave usada And el resultado obtenido 
```

**Definition of Done**

* Registro persistido
* Información consultable

***

## **E07 — Gestión de base de datos de pólizas y contactos**

**Objetivo**
&#x20;Disponer de una fuente fiable de datos de clientes.

**Outcome esperado**
&#x20;La información necesaria está disponible y actualizada para la IA.

**Alcance**

* Consumo de base exportada (Excel → BD)
* Indexación por póliza y placa
* Actualización periódica

**Fuera de alcance**

* Integración directa con sistemas legacy

***

### HU-E07-01 — Definir el modelo de datos de pólizas y contactos

** Narrativa**

**Como** equipo de producto / negocio
**Quiero** definir un modelo de datos estándar para pólizas y contactos
**Para** que la información sea consistente y reutilizable.

**Valor esperado**

* Tipo de valor: **estandarización**
* Outcome: todos los datos siguen la misma estructura.

**Reglas de negocio**

* Campos mínimos:
  * número de póliza
  * placa
  * correo electrónico
* Campos opcionales:
  * nombre del cliente
  * género
* El modelo debe ser extensible

**Criterios de aceptación**

* Existe un esquema de datos definido
* Cada campo tiene tipo y obligatoriedad
* El esquema es versionable

**Gherkin**

```
Scenario: Modelo de datos de pólizas definido Given que el sistema necesita almacenar pólizas Then existe un modelo estándar de póliza y contacto 
```

**Definition of Done**

* Modelo persistido
* Documentación accesible

***

### HU-E07-02 — Importar base de datos desde archivo externo

** Narrativa**

**Como** sistema
**Quiero** importar una base de datos externa de pólizas y contactos
**Para** disponer de información actualizada sin integración directa con sistemas legacy.

**Valor esperado**

* Tipo de valor: **habilitador**
* Outcome: el sistema puede trabajar con datos reales.

**Reglas de negocio**

* El formato inicial será archivo tipo Excel
* El archivo puede actualizarse periódicamente

**Criterios de aceptación**

* El sistema acepta un archivo válido
* Los datos se cargan correctamente
* Se detectan errores de formato

**Gherkin**

```
Scenario: Importación exitosa de base de datos Given un archivo válido de pólizas When el sistema lo importa Then los datos quedan disponibles para consulta 
```

**Definition of Done**

* Importación funcional
* Manejo de errores implementado

***

### HU-E07-03 — Validar y normalizar datos importados

** Narrativa**

**Como** sistema
**Quiero** validar y normalizar los datos importados
**Para** evitar inconsistencias en las búsquedas posteriores.

**Valor esperado**

* Tipo de valor: **calidad de datos**
* Outcome: búsquedas fiables y repetibles.

**Reglas de negocio**

* Normalización de:
  * placas (mayúsculas, sin espacios)
  * correos electrónicos
* Registros inválidos deben marcarse

**Criterios de aceptación**

* El sistema valida cada registro
* Los registros inválidos se identifican
* La normalización se aplica automáticamente

**Gherkin**

```
Scenario: Normalización de datos importados Given datos importados con formatos distintos When el sistema los procesa Then normaliza los valores correctamente 
```

**Definition of Done**

* Validaciones activas
* Registros inválidos identificables

***

### HU-E07-04 — Actualizar la base de datos de pólizas

** Narrativa**

**Como** sistema
**Quiero** actualizar la base de datos con nuevas versiones de archivo
**Para** reflejar cambios en clientes y pólizas.

**Valor esperado**

* Tipo de valor: **actualización**
* Outcome: la información no queda obsoleta.

**Reglas de negocio**

* La actualización puede:
  * añadir nuevos registros
  * actualizar existentes
* Los cambios deben ser trazables

**Criterios de aceptación**

* El sistema permite recargar la base
* Los registros se actualizan correctamente
* Se registra la fecha de actualización

**Gherkin**

```
Scenario: Actualización de base de datos Given una nueva versión del archivo When el sistema lo importa Then actualiza los registros existentes 
```

**Definition of Done**

* Actualización probada
* Historial básico disponible

***

### HU-E07-05 — Indexar la base de datos para búsquedas eficientes

** Narrativa**

**Como** sistema
**Quiero** indexar los campos clave de la base de datos
**Para** realizar búsquedas rápidas por póliza o placa.

**Valor esperado**

* Tipo de valor: **rendimiento**
* Outcome: consultas rápidas incluso con grandes volúmenes.

**Reglas de negocio**

* Índices mínimos:
  * número de póliza
  * placa
* La indexación debe actualizarse tras importaciones

**Criterios de aceptación**

* Las búsquedas usan índices
* El tiempo de respuesta es aceptable
* Los índices se regeneran cuando es necesario

**Gherkin**

```
Scenario: Búsqueda indexada Given una base de datos con índices When el sistema busca por número de póliza Then obtiene resultados de forma eficiente 
```

**Definition of Done**

* Índices activos
* Rendimiento validado

***

### HU-E07-06 — Gestionar registros incompletos o inconsistentes

** Narrativa**

**Como** sistema
**Quiero** detectar registros incompletos o inconsistentes
**Para** evitar errores en la identificación del asegurado.

**Valor esperado**

* Tipo de valor: **reducción de riesgo**
* Outcome: menos fallos en producción.

**Reglas de negocio**

* Registros sin correo se marcan como incompletos
* No se usan para respuestas automáticas

**Criterios de aceptación**

* El sistema identifica registros incompletos
* Los excluye de flujos automáticos
* Registra el motivo

**Gherkin**

```
Scenario: Registro incompleto Given un registro sin correo electrónico When el sistema lo evalúa Then lo marca como incompleto And no lo usa para respuestas automáticas 
```

**Definition of Done**

* Estados de registro definidos
* Exclusión aplicada

***

### HU-E07-07 — Visualizar el estado de la base de datos

** Narrativa**

**Como** equipo de siniestros
**Quiero** visualizar el estado general de la base de datos
**Para** saber si es fiable para el uso diario.

**Valor esperado**

* Tipo de valor: **control operativo**
* Outcome: confianza en la fuente de datos.

**Reglas de negocio**

* Debe mostrarse:
  * número total de registros
  * registros válidos
  * registros incompletos

**Criterios de aceptación**

* El estado es visible en el backoffice
* Los datos están actualizados

**Gherkin**

```
Scenario: Visualización del estado de la base Given que el usuario accede al backoffice When revisa la base de datos Then ve el estado y calidad de los registros 
```

**Definition of Done**

* Vista disponible
* Datos consistentes

***

## **E08 — Generación automática de respuestas al cliente**

**Objetivo**
&#x20;Responder automáticamente al cliente cuando se recibe un evento relevante.

**Outcome esperado**
&#x20;El cliente es informado rápido y de forma consistente.

**Alcance**

* Envío de correos:
  * aviso de siniestro recibido
  * cobertura aprobada
* Envío desde correo corporativo

**Fuera de alcance**

* WhatsApp u otros canales

***

### HU-E08-01 — Definir los eventos que disparan una respuesta automática

** Narrativa**

**Como** equipo de negocio
**Quiero** definir qué eventos del siniestro generan una respuesta automática
**Para** controlar cuándo el sistema se comunica con el cliente.

**Valor esperado**

* Tipo de valor: **control**
* Outcome: el sistema solo responde cuando debe hacerlo.

**Reglas de negocio**

* Eventos MVP:
  * aviso inicial de siniestro recibido
  * cobertura aprobada
* Los eventos deben ser configurables

**Criterios de aceptación**

* Existe un catálogo de eventos comunicables
* Cada evento puede activarse o desactivarse
* El sistema consulta este catálogo antes de enviar correos

**Gherkin**

```
Scenario: Evento habilitado para comunicación Given que un evento está marcado como comunicable When ocurre el evento Then el sistema puede generar una respuesta automática 
```

**Definition of Done**

* Catálogo persistido
* Configuración visible en backoffice

***

### HU-E08-02 — Generar el contenido del correo a partir de una plantilla

** Narrativa**

**Como** sistema
**Quiero** generar el contenido del correo usando una plantilla corporativa
**Para** asegurar mensajes coherentes y profesionales.

**Valor esperado**

* Tipo de valor: **consistencia de marca**
* Outcome: el cliente reconoce a Gerencia de Riesgos en la comunicación.

**Reglas de negocio**

* El contenido se basa en:
  * plantilla
  * datos del siniestro
  * datos del asegurado
* Las variables deben resolverse antes del envío

**Criterios de aceptación**

* El sistema sustituye correctamente las variables
* No se envían correos con variables sin resolver
* El contenido final es visible antes del envío (log)

**Gherkin**

```
Scenario: Generación de correo desde plantilla Given una plantilla válida And datos completos del siniestro When el sistema genera el correo Then produce un contenido final sin variables pendientes 
```

**Definition of Done**

* Motor de plantillas operativo
* Validaciones activas

***

### HU-E08-03 — Enviar correo automático al cliente identificado

** Narrativa**

**Como** sistema
**Quiero** enviar el correo generado al cliente identificado
**Para** informarle del estado de su siniestro.

**Valor esperado**

* Tipo de valor: **activación / confianza**
* Outcome: el cliente se siente atendido rápidamente.

**Reglas de negocio**

* El destinatario debe estar validado
* El remitente es siempre corporativo

**Criterios de aceptación**

* El correo se envía al email del asegurado
* El remitente es `siniestros@gerenciaderiesgos.com`
* El envío queda registrado

**Gherkin**

```
Scenario: Envío exitoso de correo al cliente Given que el cliente tiene correo válido When el sistema envía la comunicación Then el cliente recibe el correo correctamente 
```

**Definition of Done**

* Envío probado en entorno real
* Logs de envío disponibles

***

### HU-E08-04 — Evitar el envío automático si faltan datos críticos

** Narrativa**

**Como** sistema
**Quiero** bloquear el envío automático cuando faltan datos críticos
**Para** evitar comunicaciones incorrectas.

**Valor esperado**

* Tipo de valor: **reducción de riesgo**
* Outcome: cero correos mal enviados.

**Reglas de negocio**

* Datos críticos mínimos:
  * correo del cliente
  * tipo de evento
* Si faltan, no se envía correo

**Criterios de aceptación**

* El sistema detecta datos faltantes
* El correo no se envía
* Se registra el motivo

**Gherkin**

```
Scenario: Bloqueo de envío por datos incompletos Given que faltan datos críticos When el sistema intenta enviar el correo Then bloquea el envío And registra el motivo 
```

**Definition of Done**

* Validaciones implementadas
* Bloqueo efectivo

***

### HU-E08-05 — Enviar una única comunicación por evento

** Narrativa**

**Como** sistema
**Quiero** asegurar que cada evento genere una sola comunicación
**Para** no saturar al cliente.

**Valor esperado**

* Tipo de valor: **experiencia de cliente**
* Outcome: comunicación clara y no repetitiva.

**Reglas de negocio**

* Un evento = un correo
* El sistema debe detectar duplicados

**Criterios de aceptación**

* El sistema detecta eventos ya comunicados
* No se envían correos duplicados
* El evento queda marcado como comunicado

**Gherkin**

```
Scenario: Prevención de correos duplicados Given que un evento ya fue comunicado When el sistema vuelve a procesarlo Then no envía un nuevo correo 
```

**Definition of Done**

* Detección de duplicados operativa
* Estado persistido

***

### HU-E08-06 — Registrar el contenido y resultado del envío

** Narrativa**

**Como** equipo de siniestros
**Quiero** ver qué correos fueron enviados y con qué contenido
**Para** tener trazabilidad y control.

**Valor esperado**

* Tipo de valor: **transparencia**
* Outcome: confianza operativa en el sistema.

**Reglas de negocio**

* Debe registrarse:
  * evento
  * destinatario
  * fecha/hora
  * estado del envío

**Criterios de aceptación**

* El registro es completo
* Es consultable desde el backoffice

**Gherkin**

```
Scenario: Registro de envío de correo Given que se envía un correo Then el sistema guarda el contenido And el resultado del envío 
```

**Definition of Done**

* Registro persistido
* Información visible

***

### HU-E08-07 — Permitir desactivar respuestas automáticas por evento

** Narrativa**

**Como** equipo de negocio
**Quiero** poder desactivar la respuesta automática de un evento
**Para** adaptarme a cambios operativos o excepciones.

**Valor esperado**

* Tipo de valor: **flexibilidad**
* Outcome: control total del comportamiento del sistema.

**Reglas de negocio**

* La desactivación es inmediata
* No afecta a eventos ya comunicados

**Criterios de aceptación**

* El evento puede desactivarse
* El sistema respeta la configuración
* El cambio queda registrado

**Gherkin**

```
Scenario: Desactivación de respuesta automática Given que un evento está desactivado When ocurre el evento Then el sistema no envía ningún correo 
```

**Definition of Done**

* Configuración editable
* Auditoría básica activa

***

## **E09 — Gestión de plantillas corporativas**

**Objetivo**
&#x20;Estandarizar el contenido de las comunicaciones.

**Outcome esperado**
&#x20;Las respuestas son coherentes, humanas y alineadas a Gerencia de Riesgos.

**Alcance**

* Plantillas por tipo de evento
* Uso de género y tono
* Variables dinámicas

**Fuera de alcance**

* Decisiones de envío (eso está en E08)

***

### HU-E09-01 — Definir el catálogo de plantillas corporativas

** Narrativa**

**Como** equipo de negocio
**Quiero** definir un catálogo de plantillas corporativas
**Para** tener control explícito sobre los mensajes que se envían.

**Valor esperado**

* Tipo de valor: **control de comunicación**
* Outcome: ninguna comunicación sale “improvisada”.

**Reglas de negocio**

* Cada plantilla debe tener:
  * identificador
  * nombre descriptivo
  * tipo de evento asociado
* El catálogo debe ser editable

**Criterios de aceptación**

* Se puede crear una nueva plantilla
* Las plantillas quedan disponibles para selección
* El sistema consulta el catálogo en tiempo de ejecución

**Gherkin**

```
Scenario: Creación de plantilla corporativa Given que el usuario accede al backoffice When crea una nueva plantilla Then la plantilla queda registrada en el catálogo 
```

**Definition of Done**

* Catálogo persistido
* CRUD básico operativo

***

### HU-E09-02 — Redactar el contenido base de una plantilla

** Narrativa**

**Como** equipo de negocio
**Quiero** redactar el contenido base de una plantilla
**Para** definir el mensaje que recibirá el cliente.

**Valor esperado**

* Tipo de valor: **consistencia de tono**
* Outcome: mensajes claros, humanos y alineados a marca.

**Reglas de negocio**

* El contenido debe:
  * usar tono corporativo cercano
  * estar alineado con Gerencia de Riesgos
* No debe incluir datos hardcodeados

**Criterios de aceptación**

* Se puede editar el cuerpo del correo
* El contenido se guarda correctamente
* La plantilla puede previsualizarse

**Gherkin**

```
Scenario: Edición del contenido de una plantilla Given una plantilla existente When el usuario edita el contenido Then el sistema guarda el nuevo texto 
```

**Definition of Done**

* Editor funcional
* Cambios persistidos

***

### HU-E09-03 — Definir variables dinámicas en plantillas

** Narrativa**

**Como** sistema
**Quiero** permitir el uso de variables dinámicas en plantillas
**Para** personalizar el mensaje según cada siniestro.

**Valor esperado**

* Tipo de valor: **personalización controlada**
* Outcome: correos personalizados sin perder control.

**Reglas de negocio**

* Variables permitidas:
  * nombre del cliente
  * número de póliza
  * aseguradora
  * tipo de evento
* Las variables deben validarse

**Criterios de aceptación**

* Se pueden insertar variables en la plantilla
* El sistema valida variables soportadas
* No se permiten variables desconocidas

**Gherkin**

```
Scenario: Uso de variables en plantilla Given una plantilla con variables válidas When el sistema la procesa Then sustituye las variables correctamente 
```

**Definition of Done**

* Lista de variables documentada
* Validación activa

***

### HU-E09-04 — Gestionar plantillas por tipo de evento

** Narrativa**

**Como** equipo de negocio
**Quiero** asociar plantillas a tipos de evento
**Para** que cada comunicación use el mensaje correcto.

**Valor esperado**

* Tipo de valor: **precisión**
* Outcome: cada evento dispara el texto adecuado.

**Reglas de negocio**

* Un evento puede tener una o varias plantillas
* Solo una plantilla activa por evento

**Criterios de aceptación**

* Se puede asociar una plantilla a un evento
* El sistema selecciona la plantilla activa
* Conflictos se detectan

**Gherkin**

```
Scenario: Asociación de plantilla a evento Given un evento definido When se asocia una plantilla Then el sistema la usa para ese evento 
```

**Definition of Done**

* Asociación persistida
* Selección automática operativa

***

### HU-E09-05 — Versionar plantillas corporativas

** Narrativa**

**Como** equipo de negocio
**Quiero** versionar las plantillas
**Para** poder cambiar mensajes sin perder histórico.

**Valor esperado**

* Tipo de valor: **gobernanza**
* Outcome: cambios controlados y reversibles.

**Reglas de negocio**

* Una sola versión activa por plantilla
* Versiones antiguas deben conservarse

**Criterios de aceptación**

* Se puede crear una nueva versión
* Se puede activar/desactivar versiones
* El histórico es consultable

**Gherkin**

```
Scenario: Versionado de plantilla Given una plantilla existente When se crea una nueva versión Then el sistema mantiene el histórico 
```

**Definition of Done**

* Versionado funcional
* Histórico visible

***

### HU-E09-06 — Previsualizar plantillas con datos de ejemplo

** Narrativa**

**Como** equipo de negocio
**Quiero** previsualizar una plantilla con datos de ejemplo
**Para** validar el mensaje antes de activarlo.

**Valor esperado**

* Tipo de valor: **prevención de errores**
* Outcome: menos errores en producción.

**Reglas de negocio**

* Se usan datos ficticios
* La previsualización no envía correos

**Criterios de aceptación**

* Se puede previsualizar la plantilla
* Las variables se sustituyen
* No se envía ningún correo real

**Gherkin**

```
Scenario: Previsualización de plantilla Given una plantilla configurada When el usuario la previsualiza Then ve el correo final con datos de ejemplo 
```

**Definition of Done**

* Preview funcional
* Datos mock claros

***

### HU-E09-07 — Activar y desactivar plantillas

** Narrativa**

**Como** equipo de negocio
**Quiero** activar o desactivar plantillas
**Para** controlar qué mensajes están en uso.

**Valor esperado**

* Tipo de valor: **control operativo**
* Outcome: ninguna plantilla incorrecta se usa por error.

**Reglas de negocio**

* Solo plantillas activas pueden usarse
* El cambio es inmediato

**Criterios de aceptación**

* Se puede activar/desactivar una plantilla
* El sistema respeta el estado
* El cambio queda registrado

**Gherkin**

```
Scenario: Desactivación de plantilla Given una plantilla desactivada When ocurre un evento Then el sistema no usa esa plantilla 
```

**Definition of Done**

* Estados aplicados
* Auditoría básica activa

***

### HU-E09-08 — Registrar el uso de plantillas en comunicaciones

** Narrativa**

**Como** equipo de siniestros
**Quiero** saber qué plantilla se usó en cada correo enviado
**Para** tener trazabilidad completa.

**Valor esperado**

* Tipo de valor: **auditoría**
* Outcome: control y confianza en el sistema.

**Reglas de negocio**

* Debe registrarse:
  * plantilla
  * versión
  * evento
  * fecha/hora

**Criterios de aceptación**

* El uso de la plantilla queda registrado
* Es consultable desde el backoffice

**Gherkin**

```
Scenario: Registro de uso de plantilla Given que se envía un correo Then el sistema registra la plantilla utilizada 
```

**Definition of Done**

* Registro persistido
* Información accesible

## **E10 — Manejo de excepciones y errores**

**Objetivo**
&#x20;Gestionar los casos donde la IA no puede actuar.

**Outcome esperado**
&#x20;Ningún siniestro se pierde por silencio del sistema.

**Alcance**

* Detección de:
  * falta de correo del cliente
  * datos incompletos
* Notificación interna automática

**Fuera de alcance**

* Corrección manual de datos

***

### HU-E10-01 — Detectar errores técnicos del sistema

** Narrativa**

**Como** sistema
**Quiero** detectar errores técnicos durante la ejecución
**Para** evitar que el flujo se rompa sin aviso.

**Valor esperado**

* Tipo de valor: **resiliencia**
* Outcome: el sistema es confiable incluso cuando falla.

**Reglas de negocio**

* Errores técnicos incluyen:
  * fallos de conexión
  * errores de parsing
  * timeouts
* Todo error debe capturarse

**Criterios de aceptación**

* El sistema detecta errores técnicos
* El error no detiene otros procesos
* El error queda registrado

**Gherkin**

```
Scenario: Error técnico detectado Given que ocurre un error técnico When el sistema lo detecta Then registra el error And evita la caída del proceso completo 
```

**Definition of Done**

* Manejo de excepciones implementado
* Registro centralizado activo

***

### HU-E10-02 — Gestionar errores funcionales del flujo

** Narrativa**

**Como** sistema
**Quiero** detectar errores funcionales del flujo de siniestros
**Para** saber cuándo no puedo continuar automáticamente.

**Valor esperado**

* Tipo de valor: **control operativo**
* Outcome: decisiones automáticas seguras.

**Reglas de negocio**

* Errores funcionales incluyen:
  * datos incompletos
  * asegurado no encontrado
  * ambigüedad en resultados
* No se debe forzar el flujo

**Criterios de aceptación**

* El sistema identifica errores funcionales
* Marca el siniestro como “bloqueado”
* No envía comunicación automática

**Gherkin**

```
Scenario: Error funcional detectado Given que el siniestro tiene datos incompletos When el sistema valida el estado Then bloquea el flujo automático 
```

**Definition of Done**

* Estados funcionales definidos
* Bloqueo efectivo

***

### HU-E10-03 — Clasificar el tipo de excepción

** Narrativa**

**Como** sistema
**Quiero** clasificar las excepciones por tipo
**Para** aplicar el tratamiento adecuado.

**Valor esperado**

* Tipo de valor: **claridad**
* Outcome: cada problema tiene una respuesta clara.

**Reglas de negocio**

* Tipos mínimos:
  * técnica
  * funcional
  * datos
* Una excepción tiene un solo tipo principal

**Criterios de aceptación**

* Cada excepción queda clasificada
* La clasificación es visible

**Gherkin**

```
Scenario: Clasificación de excepción Given que ocurre una excepción When el sistema la registra Then la clasifica por tipo 
```

**Definition of Done**

* Tipos definidos
* Clasificación persistida

***

### HU-E10-04 — Detener el flujo automático ante excepciones críticas

** Narrativa**

**Como** sistema
**Quiero** detener el flujo automático cuando ocurre una excepción crítica
**Para** evitar acciones incorrectas.

**Valor esperado**

* Tipo de valor: **protección**
* Outcome: cero acciones automáticas erróneas.

**Reglas de negocio**

* Excepciones críticas:
  * datos clave ausentes
  * errores de identificación del cliente
* El sistema no debe “forzar” continuaciones

**Criterios de aceptación**

* El flujo se detiene
* No se envían correos automáticos
* El estado queda claro

**Gherkin**

```
Scenario: Bloqueo por excepción crítica Given una excepción crítica When el sistema la detecta Then detiene el flujo automático 
```

**Definition of Done**

* Bloqueos efectivos
* Estados claros

***

### HU-E10-05 — Notificar excepciones al equipo interno

** Narrativa**

**Como** equipo de siniestros
**Quiero** ser notificado cuando ocurre una excepción
**Para** intervenir a tiempo.

**Valor esperado**

* Tipo de valor: **acción humana eficiente**
* Outcome: el equipo actúa solo cuando hace falta.

**Reglas de negocio**

* La notificación se envía al buzón de siniestros
* El mensaje debe ser claro y accionable

**Criterios de aceptación**

* El equipo recibe una notificación
* El mensaje indica:
  * qué pasó
  * por qué
  * qué falta

**Gherkin**

```
Scenario: Notificación de excepción Given una excepción registrada When el sistema la procesa Then envía una notificación interna 
```

**Definition of Done**

* Notificaciones activas
* Contenido claro

***

### HU-E10-06 — Registrar el detalle completo de la excepción

** Narrativa**

**Como** equipo de siniestros
**Quiero** ver el detalle completo de una excepción
**Para** entenderla y resolverla correctamente.

**Valor esperado**

* Tipo de valor: **diagnóstico**
* Outcome: resolución más rápida de problemas.

**Reglas de negocio**

* El registro debe incluir:
  * contexto
  * datos disponibles
  * motivo del fallo

**Criterios de aceptación**

* El detalle queda registrado
* Es consultable desde el backoffice

**Gherkin**

```
Scenario: Registro detallado de excepción Given una excepción Then el sistema guarda el detalle completo 
```

**Definition of Done**

* Registro accesible
* Información suficiente

***

### HU-E10-07 — Permitir la resolución manual de excepciones

** Narrativa**

**Como** equipo de siniestros
**Quiero** poder resolver manualmente una excepción
**Para** continuar el flujo cuando sea posible.

**Valor esperado**

* Tipo de valor: **continuidad**
* Outcome: el trabajo no se queda bloqueado.

**Reglas de negocio**

* La resolución manual debe quedar registrada
* El flujo puede retomarse desde el punto correcto

**Criterios de aceptación**

* El equipo puede marcar una excepción como resuelta
* El sistema permite continuar el flujo
* Se registra quién resolvió y cuándo

**Gherkin**

```
Scenario: Resolución manual de excepción Given una excepción bloqueante When el usuario la resuelve manualmente Then el sistema permite continuar el flujo 
```

**Definition of Done**

* Resolución manual operativa
* Auditoría básica activa

***

### HU-E10-08 — Analizar excepciones recurrentes

** Narrativa**

**Como** Product Manager / equipo
**Quiero** identificar excepciones recurrentes
**Para** mejorar reglas, datos o automatismos.

**Valor esperado**

* Tipo de valor: **mejora continua**
* Outcome: el sistema aprende de sus fallos.

**Reglas de negocio**

* Se deben poder agrupar excepciones por tipo
* La información debe ser consultable

**Criterios de aceptación**

* Se pueden ver excepciones frecuentes
* El equipo puede priorizar mejoras

**Gherkin**

```
Scenario: Análisis de excepciones recurrentes Given múltiples excepciones registradas When el equipo revisa el histórico Then identifica patrones recurrentes 
```

**Definition of Done**

* Información accesible
* Base para mejoras definida

***

## **E11 — Trazabilidad y estado del siniestro**

**Objetivo**
&#x20;Dar continuidad al flujo del siniestro en el tiempo.

**Outcome esperado**
&#x20;El sistema sabe “en qué punto está cada siniestro”.

**Alcance**

* Registro de eventos
* Estados del siniestro
* Relación entre correos

**Fuera de alcance**

* Reporting avanzado

***

### HU-E11-01 — Definir el ciclo de vida del siniestro

** Narrativa**

**Como** Product Manager / equipo de negocio
**Quiero** definir los estados por los que pasa un siniestro
**Para** tener un flujo claro y compartido por todo el sistema.

**Valor esperado**

* Tipo de valor: **claridad de proceso**
* Outcome: todos hablan el mismo lenguaje de estados.

**Reglas de negocio**

* Estados mínimos MVP:
  * detectado
  * datos extraídos
  * asegurado identificado
  * comunicado al cliente
  * bloqueado por excepción
  * cerrado
* El flujo debe ser extensible

**Criterios de aceptación**

* Existe un catálogo de estados
* Cada estado tiene una descripción clara
* El flujo de estados está documentado

**Gherkin**

```
Scenario: Definición del ciclo de vida Given que el sistema gestiona siniestros Then existe un ciclo de vida definido con estados claros 
```

**Definition of Done**

* Estados persistidos
* Documentación accesible

***

### HU-E11-02 — Crear un identificador único de siniestro

** Narrativa**

**Como** sistema
**Quiero** asignar un identificador único a cada siniestro
**Para** poder relacionar correos y eventos a lo largo del tiempo.

**Valor esperado**

* Tipo de valor: **trazabilidad**
* Outcome: cada siniestro es inequívoco.

**Reglas de negocio**

* El identificador es interno al sistema
* No depende del número de póliza

**Criterios de aceptación**

* Cada siniestro tiene un ID único
* El ID se mantiene durante todo el ciclo de vida

**Gherkin**

```
Scenario: Creación de identificador de siniestro Given que se detecta un nuevo siniestro When el sistema lo registra Then asigna un identificador único 
```

**Definition of Done**

* ID único generado
* Persistencia garantizada

***

### HU-E11-03 — Asociar correos entrantes a un siniestro existente

** Narrativa**

**Como** sistema
**Quiero** asociar correos posteriores a un siniestro existente
**Para** mantener la continuidad del flujo.

**Valor esperado**

* Tipo de valor: **continuidad**
* Outcome: los correos no crean siniestros duplicados.

**Reglas de negocio**

* La asociación se basa en:
  * número de póliza
  * placa
  * referencias del correo
* Si no hay coincidencia, se crea un nuevo siniestro

**Criterios de aceptación**

* El sistema asocia correos correctamente
* Evita duplicados cuando hay coincidencia clara

**Gherkin**

```
Scenario: Asociación de correo a siniestro existente Given un correo relacionado con un siniestro previo When el sistema lo procesa Then lo asocia al siniestro existente 
```

**Definition of Done**

* Asociación validada
* Duplicados evitados

***

### HU-E11-04 — Registrar eventos ocurridos en el siniestro

** Narrativa**

**Como** sistema
**Quiero** registrar cada evento relevante del siniestro
**Para** construir un historial completo.

**Valor esperado**

* Tipo de valor: **auditoría**
* Outcome: se puede reconstruir todo lo ocurrido.

**Reglas de negocio**

* Eventos incluyen:
  * correo recibido
  * clasificación
  * extracción
  * comunicación enviada
  * excepción
* Los eventos son inmutables

**Criterios de aceptación**

* Cada evento queda registrado
* El evento tiene fecha y contexto

**Gherkin**

```
Scenario: Registro de evento de siniestro Given que ocurre una acción relevante When el sistema la ejecuta Then registra un evento asociado al siniestro 
```

**Definition of Done**

* Registro de eventos persistido
* Orden temporal correcto

***

### HU-E11-05 — Actualizar el estado del siniestro automáticamente

** Narrativa**

**Como** sistema
**Quiero** actualizar el estado del siniestro según los eventos
**Para** reflejar la situación real en cada momento.

**Valor esperado**

* Tipo de valor: **automatización**
* Outcome: el estado siempre está actualizado.

**Reglas de negocio**

* Cada evento puede provocar un cambio de estado
* Los cambios deben seguir el flujo definido

**Criterios de aceptación**

* El estado cambia automáticamente
* Cambios inválidos son bloqueados

**Gherkin**

```
Scenario: Cambio automático de estado Given un evento válido del flujo When el sistema lo registra Then actualiza el estado del siniestro 
```

**Definition of Done**

* Transiciones controladas
* Estados coherentes

***

### HU-E11-06 — Visualizar el historial completo de un siniestro

** Narrativa**

**Como** equipo de siniestros
**Quiero** ver el historial completo de un siniestro
**Para** entender rápidamente qué ha ocurrido.

**Valor esperado**

* Tipo de valor: **eficiencia operativa**
* Outcome: menos tiempo investigando casos.

**Reglas de negocio**

* El historial debe mostrarse en orden cronológico
* Debe ser legible y claro

**Criterios de aceptación**

* El historial es visible desde el backoffice
* Incluye eventos, estados y fechas

**Gherkin**

```
Scenario: Visualización del historial Given un siniestro existente When el usuario revisa su detalle Then ve el historial completo de eventos 
```

**Definition of Done**

* Vista funcional
* Información comprensible

***

### HU-E11-07 — Permitir la intervención manual sobre el estado

** Narrativa**

**Como** equipo de siniestros
**Quiero** poder cambiar manualmente el estado de un siniestro
**Para** resolver casos excepcionales.

**Valor esperado**

* Tipo de valor: **flexibilidad controlada**
* Outcome: el equipo puede desbloquear situaciones reales.

**Reglas de negocio**

* Solo roles autorizados
* El cambio debe quedar registrado

**Criterios de aceptación**

* El usuario puede cambiar el estado
* El cambio queda auditado

**Gherkin**

```
Scenario: Cambio manual de estado Given un usuario autorizado When cambia el estado del siniestro Then el sistema registra la acción 
```

**Definition of Done**

* Permisos aplicados
* Auditoría activa

***

### HU-E11-08 — Cerrar un siniestro

** Narrativa**

**Como** sistema / equipo de siniestros
**Quiero** cerrar un siniestro cuando el flujo ha terminado
**Para** indicar que no requiere más acciones.

**Valor esperado**

* Tipo de valor: **orden**
* Outcome: los siniestros activos reflejan trabajo real.

**Reglas de negocio**

* Un siniestro cerrado no dispara nuevas acciones automáticas
* Puede consultarse en histórico

**Criterios de aceptación**

* El siniestro puede marcarse como cerrado
* El sistema deja de procesarlo automáticamente

**Gherkin**

```
Scenario: Cierre de siniestro Given que el flujo del siniestro terminó When se cierra el siniestro Then el sistema no ejecuta más acciones automáticas 
```

**Definition of Done**

* Estado cerrado funcional
* Comportamiento validado

***

## **E12 — Notificaciones internas al equipo**

**Objetivo**
&#x20;Mantener informado al equipo humano cuando hace falta.

**Outcome esperado**
&#x20;El equipo actúa solo cuando aporta valor.

**Alcance**

* Correos internos automáticos
* Asuntos estandarizados

**Fuera de alcance**

* Gestión de tareas humanas

***

### HU-E12-01 — Definir los eventos que generan notificaciones internas

** Narrativa**

**Como** equipo de negocio
**Quiero** definir qué eventos del sistema generan notificaciones internas
**Para** controlar cuándo se avisa al equipo humano.

**Valor esperado**

* Tipo de valor: **control**
* Outcome: el equipo no recibe ruido innecesario.

**Reglas de negocio**

* Eventos mínimos MVP:
  * excepción bloqueante
  * asegurado no encontrado
  * formato de correo no reconocido
* Los eventos deben ser configurables

**Criterios de aceptación**

* Existe un catálogo de eventos notificables
* Cada evento puede activarse o desactivarse
* El sistema consulta esta configuración antes de notificar

**Gherkin**

```
Scenario: Evento configurado como notificable Given que un evento está marcado como notificable When ocurre el evento Then el sistema genera una notificación interna 
```

**Definition of Done**

* Catálogo persistido
* Configuración visible en backoffice

***

### HU-E12-02 — Enviar notificaciones al buzón interno de siniestros

** Narrativa**

**Como** sistema
**Quiero** enviar notificaciones al buzón interno del equipo de siniestros
**Para** asegurar que la información llega al canal correcto.

**Valor esperado**

* Tipo de valor: **eficiencia operativa**
* Outcome: el equipo recibe avisos donde ya trabaja.

**Reglas de negocio**

* El destinatario es el buzón corporativo configurado
* El remitente es siempre el sistema corporativo

**Criterios de aceptación**

* La notificación llega al buzón configurado
* El asunto identifica claramente el tipo de problema
* El correo se envía correctamente

**Gherkin**

```
Scenario: Envío de notificación interna Given que ocurre un evento notificable When el sistema envía la notificación Then el equipo recibe el correo interno 
```

**Definition of Done**

* Envío probado
* Canal correcto validado

***

### HU-E12-03 — Incluir información accionable en la notificación

** Narrativa**

**Como** equipo de siniestros
**Quiero** que cada notificación incluya información clara y accionable
**Para** saber qué hacer sin investigar de más.

**Valor esperado**

* Tipo de valor: **productividad**
* Outcome: menos tiempo entendiendo el problema.

**Reglas de negocio**

* La notificación debe incluir:
  * identificador del siniestro
  * tipo de problema
  * siguiente acción sugerida

**Criterios de aceptación**

* El correo incluye los datos clave
* El mensaje es comprensible sin contexto adicional

**Gherkin**

```
Scenario: Notificación con información accionable Given una notificación enviada Then incluye el ID del siniestro And describe el problema y la acción sugerida 
```

**Definition of Done**

* Contenido claro
* Información completa

***

### HU-E12-04 — Diferenciar notificaciones por nivel de criticidad

** Narrativa**

**Como** sistema
**Quiero** diferenciar notificaciones según su criticidad
**Para** priorizar la atención del equipo.

**Valor esperado**

* Tipo de valor: **priorización**
* Outcome: el equipo atiende primero lo importante.

**Reglas de negocio**

* Niveles mínimos:
  * informativa
  * advertencia
  * crítica
* La criticidad se refleja en el asunto del correo

**Criterios de aceptación**

* Cada notificación tiene un nivel asignado
* El nivel es visible en el asunto y contenido

**Gherkin**

```
Scenario: Notificación crítica Given una excepción crítica When se genera la notificación Then se marca como crítica en el asunto 
```

**Definition of Done**

* Niveles definidos
* Clasificación operativa

***

### HU-E12-05 — Evitar notificaciones duplicadas por el mismo evento

** Narrativa**

**Como** sistema
**Quiero** evitar el envío de notificaciones duplicadas
**Para** no saturar al equipo.

**Valor esperado**

* Tipo de valor: **experiencia interna**
* Outcome: menos fatiga por alertas.

**Reglas de negocio**

* Un evento genera una sola notificación
* Duplicados deben detectarse

**Criterios de aceptación**

* El sistema detecta notificaciones ya enviadas
* No envía correos repetidos por el mismo evento

**Gherkin**

```
Scenario: Prevención de notificación duplicada Given que un evento ya fue notificado When el sistema lo vuelve a procesar Then no envía una nueva notificación 
```

**Definition of Done**

* Detección de duplicados operativa
* Estado persistido

***

### HU-E12-06 — Registrar el envío de notificaciones internas

** Narrativa**

**Como** equipo de siniestros
**Quiero** ver qué notificaciones fueron enviadas
**Para** tener trazabilidad y control.

**Valor esperado**

* Tipo de valor: **auditoría**
* Outcome: confianza en el sistema.

**Reglas de negocio**

* Debe registrarse:
  * evento
  * destinatario
  * fecha/hora
  * criticidad

**Criterios de aceptación**

* El registro es completo
* Es consultable desde el backoffice

**Gherkin**

```
Scenario: Registro de notificación interna Given que se envía una notificación Then el sistema registra el envío y su contexto 
```

**Definition of Done**

* Registro persistido
* Información accesible

***

### HU-E12-07 — Permitir configurar el buzón de notificaciones internas

** Narrativa**

**Como** equipo de negocio
**Quiero** configurar el buzón interno de notificaciones
**Para** adaptar el sistema a cambios organizativos.

**Valor esperado**

* Tipo de valor: **flexibilidad**
* Outcome: el sistema se adapta sin desarrollo.

**Reglas de negocio**

* El buzón debe ser corporativo
* El cambio debe ser inmediato

**Criterios de aceptación**

* Se puede modificar el buzón de destino
* El sistema usa la nueva configuración

**Gherkin**

```
Scenario: Cambio de buzón interno Given que el usuario cambia el buzón de notificaciones When ocurre un evento Then la notificación se envía al nuevo buzón 
```

**Definition of Done**

* Configuración editable
* Cambio aplicado correctamente

***

## **E13 — Backoffice de configuración y operación**

**Objetivo**
&#x20;Permitir operar y ajustar el sistema sin desarrollo.

**Outcome esperado**
&#x20;El sistema evoluciona con la operación real.

**Alcance**

* Configuración de:
  * formatos
  * plantillas
  * reglas
* Visualización de errores

**Fuera de alcance**

* Seguridad y permisos (ver E15)

***

### HU-E13-01 — Acceder al backoffice de operación

** Narrativa**

**Como** miembro autorizado del equipo
**Quiero** acceder a un backoffice central
**Para** gestionar y supervisar el sistema.

**Valor esperado**

* Tipo de valor: **operabilidad**
* Outcome: punto único de control del producto.

**Reglas de negocio**

* Acceso restringido a usuarios autorizados
* El backoffice es solo para uso interno

**Criterios de aceptación**

* El usuario puede acceder al backoffice
* El acceso requiere autenticación
* Los accesos quedan registrados

**Gherkin**

```
Scenario: Acceso al backoffice Given un usuario autorizado When accede al backoffice Then el sistema permite el acceso 
```

**Definition of Done**

* Acceso funcional
* Registro de accesos activo

***

### HU-E13-02 — Visualizar el estado general del sistema

** Narrativa**

**Como** equipo de siniestros
**Quiero** ver el estado general del sistema
**Para** saber si todo está funcionando correctamente.

**Valor esperado**

* Tipo de valor: **visibilidad**
* Outcome: detección temprana de problemas.

**Reglas de negocio**

* El estado debe mostrar:
  * integraciones activas
  * siniestros en curso
  * excepciones abiertas

**Criterios de aceptación**

* El estado se muestra de forma clara
* La información está actualizada

**Gherkin**

```
Scenario: Visualización del estado del sistema Given que el usuario accede al backoffice When revisa el dashboard Then ve el estado general del sistema 
```

**Definition of Done**

* Dashboard operativo
* Datos consistentes

***

### HU-E13-03 — Configurar parámetros operativos del sistema

** Narrativa**

**Como** equipo de negocio
**Quiero** configurar parámetros operativos
**Para** adaptar el sistema a la realidad diaria.

**Valor esperado**

* Tipo de valor: **flexibilidad**
* Outcome: cambios rápidos sin desarrollo.

**Reglas de negocio**

* Parámetros incluyen:
  * buzones de correo
  * eventos activos
  * umbrales de confianza
* Los cambios deben ser inmediatos

**Criterios de aceptación**

* Los parámetros son editables
* Los cambios se aplican sin reiniciar el sistema

**Gherkin**

```
Scenario: Cambio de parámetro operativo Given un parámetro configurable When el usuario lo modifica Then el sistema aplica el cambio inmediatamente 
```

**Definition of Done**

* Parámetros persistidos
* Aplicación inmediata validada

***

### HU-E13-04 — Gestionar configuraciones funcionales clave

** Narrativa**

**Como** equipo de negocio
**Quiero** gestionar configuraciones funcionales
**Para** controlar el comportamiento del sistema.

**Valor esperado**

* Tipo de valor: **gobernanza**
* Outcome: comportamiento predecible de la IA.

**Reglas de negocio**

* Configuraciones incluyen:
  * formatos de aseguradoras
  * plantillas
  * reglas de clasificación

**Criterios de aceptación**

* Las configuraciones son accesibles
* Se pueden activar/desactivar

**Gherkin**

```
Scenario: Gestión de configuración funcional Given una configuración existente When el usuario la modifica Then el sistema respeta la nueva configuración 
```

**Definition of Done**

* Configuración operativa
* Cambios trazables

***

### HU-E13-05 — Visualizar siniestros y su estado desde el backoffice

** Narrativa**

**Como** equipo de siniestros
**Quiero** ver la lista de siniestros y su estado
**Para** tener control operativo del trabajo.

**Valor esperado**

* Tipo de valor: **eficiencia**
* Outcome: comprensión rápida del workload.

**Reglas de negocio**

* Debe mostrarse:
  * ID del siniestro
  * estado actual
  * alertas abiertas

**Criterios de aceptación**

* La lista es accesible
* Los estados son claros

**Gherkin**

```
Scenario: Visualización de siniestros Given que existen siniestros registrados When el usuario revisa el backoffice Then ve la lista y su estado 
```

**Definition of Done**

* Vista funcional
* Información actualizada

***

### HU-E13-06 — Consultar el detalle completo de un siniestro

** Narrativa**

**Como** equipo de siniestros
**Quiero** consultar el detalle de un siniestro
**Para** entender su situación y actuar.

**Valor esperado**

* Tipo de valor: **diagnóstico**
* Outcome: resolución más rápida de casos.

**Reglas de negocio**

* El detalle incluye:
  * historial de eventos
  * datos extraídos
  * comunicaciones enviadas
  * excepciones

**Criterios de aceptación**

* El detalle es completo y legible
* La información está ordenada cronológicamente

**Gherkin**

```
Scenario: Consulta de detalle de siniestro Given un siniestro existente When el usuario accede a su detalle Then ve toda la información relevante 
```

**Definition of Done**

* Vista detallada operativa
* Datos consistentes

***

### HU-E13-07 — Realizar acciones manuales desde el backoffice

** Narrativa**

**Como** equipo de siniestros
**Quiero** ejecutar acciones manuales desde el backoffice
**Para** resolver excepciones o casos especiales.

**Valor esperado**

* Tipo de valor: **intervención controlada**
* Outcome: continuidad del flujo cuando la IA no puede.

**Reglas de negocio**

* Acciones posibles:
  * reintentar procesamiento
  * cerrar siniestro
  * desbloquear flujo
* Todas las acciones deben quedar registradas

**Criterios de aceptación**

* El usuario puede ejecutar acciones permitidas
* El sistema registra la acción y el resultado

**Gherkin**

```
Scenario: Acción manual desde backoffice Given un usuario autorizado When ejecuta una acción manual Then el sistema la aplica y la registra 
```

**Definition of Done**

* Acciones disponibles
* Auditoría activa

***

### HU-E13-08 — Registrar cambios y acciones realizadas en el backoffice

** Narrativa**

**Como** equipo de compliance / producto
**Quiero** que todos los cambios y acciones queden registrados
**Para** asegurar trazabilidad y control.

**Valor esperado**

* Tipo de valor: **auditoría**
* Outcome: confianza y control corporativo.

**Reglas de negocio**

* Debe registrarse:
  * usuario
  * acción
  * fecha/hora
  * impacto

**Criterios de aceptación**

* Cada acción queda registrada
* El registro es consultable

**Gherkin**

```
Scenario: Registro de acción en backoffice Given que el usuario realiza una acción Then el sistema registra quién, qué y cuándo 
```

**Definition of Done**

* Registro persistido
* Accesible para auditoría

***

## **E14 — Experiencia visual y consistencia de marca**

**Objetivo**
&#x20;Alinear la aplicación con la identidad de Gerencia de Riesgos.

**Outcome esperado**
&#x20;La herramienta se percibe como producto corporativo, no como “sistema”.

**Alcance**

* Colores
* Tipografías
* Tono visual y textual

**Fuera de alcance**

* Funcionalidad

***

### HU-E14-01 — Definir la guía visual base del producto

** Narrativa**

**Como** Product Manager / equipo de marca
**Quiero** definir una guía visual base del producto
**Para** asegurar coherencia en toda la interfaz.

**Valor esperado**

* Tipo de valor: **consistencia**
* Outcome: todas las pantallas “hablan el mismo idioma visual”.

**Reglas de negocio**

* La guía debe incluir:
  * colores corporativos
  * tipografías
  * estilos de botones y estados
* Debe alinearse con la web de Gerencia de Riesgos

**Criterios de aceptación**

* Existe una guía visual definida
* Es usada como referencia por todo el producto

**Gherkin**

```
Scenario: Guía visual definida Given que se diseña una nueva pantalla Then se basa en la guía visual corporativa 
```

**Definition of Done**

* Guía documentada
* Accesible al equipo

***

### HU-E14-02 — Aplicar colores corporativos en la interfaz

** Narrativa**

**Como** usuario interno
**Quiero** que la interfaz use los colores de Gerencia de Riesgos
**Para** reconocer el producto como corporativo.

**Valor esperado**

* Tipo de valor: **confianza**
* Outcome: percepción de herramienta oficial.

**Reglas de negocio**

* Colores alineados con la web corporativa
* Uso consistente en fondos, botones y estados

**Criterios de aceptación**

* Los colores principales coinciden con la marca
* No hay colores “inventados”

**Gherkin**

```
Scenario: Uso de colores corporativos Given que visualizo la aplicación Then los colores coinciden con la identidad corporativa 
```

**Definition of Done**

* Colores aplicados
* Consistencia validada

***

### HU-E14-03 — Unificar tipografías y jerarquía visual

** Narrativa**

**Como** usuario interno
**Quiero** una jerarquía visual clara y consistente
**Para** entender fácilmente la información.

**Valor esperado**

* Tipo de valor: **usabilidad**
* Outcome: menor carga cognitiva.

**Reglas de negocio**

* Tipografías alineadas a la marca
* Jerarquía clara (títulos, subtítulos, texto)

**Criterios de aceptación**

* Se usan las mismas tipografías en todo el producto
* La jerarquía es consistente

**Gherkin**

```
Scenario: Jerarquía visual consistente Given diferentes pantallas del producto Then mantienen la misma jerarquía tipográfica 
```

**Definition of Done**

* Tipografías unificadas
* Jerarquía clara

***

### HU-E14-04 — Definir el tono visual y textual del producto

** Narrativa**

**Como** equipo de producto
**Quiero** definir un tono visual y textual
**Para** que el producto sea profesional pero cercano.

**Valor esperado**

* Tipo de valor: **identidad**
* Outcome: coherencia entre interfaz y comunicaciones.

**Reglas de negocio**

* Tono:
  * profesional
  * claro
  * humano
* Sin lenguaje técnico innecesario

**Criterios de aceptación**

* Textos claros y comprensibles
* Mensajes alineados con la marca

**Gherkin**

```
Scenario: Tono de comunicación definido Given un mensaje del sistema Then usa un tono profesional y cercano 
```

**Definition of Done**

* Tono documentado
* Textos revisados

***

### HU-E14-05 — Diseñar pantallas del backoffice alineadas a marca

** Narrativa**

**Como** usuario interno
**Quiero** que el backoffice esté alineado visualmente a la marca
**Para** no sentir que uso una herramienta improvisada.

**Valor esperado**

* Tipo de valor: **credibilidad**
* Outcome: mayor adopción interna.

**Reglas de negocio**

* El backoffice sigue la misma guía visual
* No es un “panel técnico sin diseño”

**Criterios de aceptación**

* El backoffice respeta colores y tipografías
* La interfaz es clara y consistente

**Gherkin**

```
Scenario: Backoffice alineado a marca Given que accedo al backoffice Then la experiencia visual es coherente con la marca 
```

**Definition of Done**

* Backoffice estilizado
* Consistencia validada

***

### HU-E14-06 — Aplicar consistencia visual en estados y mensajes

** Narrativa**

**Como** usuario interno
**Quiero** que los estados y mensajes visuales sean consistentes
**Para** entender rápidamente qué está pasando.

**Valor esperado**

* Tipo de valor: **claridad**
* Outcome: menos errores de interpretación.

**Reglas de negocio**

* Estados visuales:
  * éxito
  * advertencia
  * error
* Uso consistente de iconos y colores

**Criterios de aceptación**

* Estados visuales claros
* Mismos patrones en todo el producto

**Gherkin**

```
Scenario: Estados visuales consistentes Given diferentes estados del sistema Then usan los mismos colores e iconos 
```

**Definition of Done**

* Estados definidos
* Uso consistente

***

### HU-E14-07 — Alinear correos enviados con la identidad visual

** Narrativa**

**Como** cliente final
**Quiero** que los correos recibidos reflejen la identidad de Gerencia de Riesgos
**Para** confiar en la comunicación.

**Valor esperado**

* Tipo de valor: **confianza externa**
* Outcome: el cliente reconoce la marca en el correo.

**Reglas de negocio**

* Uso de:
  * logo
  * colores
  * firma corporativa
* Compatible con clientes de correo comunes

**Criterios de aceptación**

* Los correos tienen identidad visual corporativa
* Se visualizan correctamente en distintos clientes

**Gherkin**

```
Scenario: Correo con identidad visual Given un correo enviado al cliente Then refleja la identidad visual de Gerencia de Riesgos 
```

**Definition of Done**

* Plantillas visuales aplicadas
* Pruebas en distintos clientes

***

### HU-E14-08 — Validar accesibilidad básica de la interfaz

** Narrativa**

**Como** organización inclusiva
**Quiero** que la interfaz cumpla criterios básicos de accesibilidad
**Para** que pueda ser usada por más personas.

**Valor esperado**

* Tipo de valor: **inclusión**
* Outcome: producto usable por un público diverso.

**Reglas de negocio**

* Contraste suficiente
* Textos legibles
* Navegación clara

**Criterios de aceptación**

* Contraste validado
* Textos legibles
* No hay dependencias solo visuales

**Gherkin**

```
Scenario: Accesibilidad básica Given que un usuario navega la interfaz Then puede leer y entender el contenido sin barreras 
```

**Definition of Done**

* Accesibilidad validada
* Cumplimiento básico asegurado

***

## **E15 — Seguridad, control y uso corporativo**

**Objetivo**
&#x20;Proteger a la empresa frente a riesgos operativos, legales y reputacionales.

**Outcome esperado**
&#x20;La IA es confiable, auditable y controlable.

**Alcance**

* Autenticación y roles
* Auditoría de acciones
* Kill switch
* Protección de datos

**Fuera de alcance**

* Operación diaria

***

### HU-E15-01 — Autenticación de usuarios internos

** Narrativa**

**Como** organización
**Quiero** que el acceso al sistema esté protegido por autenticación
**Para** evitar accesos no autorizados.

**Valor esperado**

* Tipo de valor: **seguridad**
* Outcome: solo personal autorizado accede al sistema.

**Reglas de negocio**

* Acceso solo para usuarios corporativos
* Autenticación integrada con el sistema definido (ej. Google Workspace)

**Criterios de aceptación**

* El usuario debe autenticarse para acceder
* Usuarios no autenticados no pueden entrar
* El acceso queda registrado

**Gherkin**

```
Scenario: Acceso autenticado al sistema Given un usuario no autenticado When intenta acceder al backoffice Then el sistema solicita autenticación 
```

**Definition of Done**

* Autenticación activa
* Accesos registrados

***

### HU-E15-02 — Gestión de roles y permisos

** Narrativa**

**Como** organización
**Quiero** definir roles y permisos
**Para** limitar qué puede hacer cada usuario.

**Valor esperado**

* Tipo de valor: **control**
* Outcome: cada persona solo puede hacer lo que le corresponde.

**Reglas de negocio**

* Roles mínimos:
  * solo lectura
  * operador/a
  * administrador/a
* Los permisos se asignan por rol

**Criterios de aceptación**

* Cada rol tiene permisos definidos
* El sistema valida permisos antes de cada acción

**Gherkin**

```
Scenario: Acción no permitida por rol Given un usuario con rol solo lectura When intenta modificar una configuración Then el sistema bloquea la acción 
```

**Definition of Done**

* Roles definidos
* Validación de permisos activa

***

### HU-E15-03 — Garantizar actuación como rol corporativo

** Narrativa**

**Como** organización
**Quiero** que el sistema actúe siempre como rol corporativo
**Para** evitar suplantaciones o confusión.

**Valor esperado**

* Tipo de valor: **protección reputacional**
* Outcome: la IA siempre representa a Gerencia de Riesgos.

**Reglas de negocio**

* Correos enviados siempre desde `siniestros@gerenciaderiesgos.com`
* No se usan nombres personales como remitente

**Criterios de aceptación**

* El remitente es siempre corporativo
* No aparece ningún usuario individual como emisor

**Gherkin**

```
Scenario: Envío corporativo de correos Given que el sistema envía un correo Then el remitente es siempre corporativo 
```

**Definition of Done**

* Remitente controlado
* Validación automática

***

### HU-E15-04 — Proteger datos sensibles del sistema

** Narrativa**

**Como** organización
**Quiero** proteger los datos sensibles que maneja el sistema
**Para** cumplir con requisitos legales y de privacidad.

**Valor esperado**

* Tipo de valor: **cumplimiento y confianza**
* Outcome: datos protegidos frente a accesos indebidos.

**Reglas de negocio**

* Datos sensibles:
  * correos electrónicos
  * pólizas
  * información personal
* No deben mostrarse completos sin permiso

**Criterios de aceptación**

* Los datos sensibles están protegidos
* No aparecen en logs sin control
* Acceso limitado por rol

**Gherkin**

```
Scenario: Protección de datos sensibles Given un usuario sin permisos suficientes When accede a un siniestro Then no ve datos sensibles completos 
```

**Definition of Done**

* Protección aplicada
* Accesos controlados

***

### HU-E15-05 — Registrar auditoría de acciones relevantes

** Narrativa**

**Como** organización
**Quiero** registrar todas las acciones relevantes del sistema y usuarios
**Para** poder auditar el uso del producto.

**Valor esperado**

* Tipo de valor: **auditoría**
* Outcome: trazabilidad completa de quién hizo qué y cuándo.

**Reglas de negocio**

* Acciones auditables:
  * cambios de configuración
  * envíos de correos
  * acciones manuales
* Los registros son inmutables

**Criterios de aceptación**

* Cada acción relevante queda registrada
* El registro es consultable

**Gherkin**

```
Scenario: Auditoría de acción Given que un usuario realiza una acción relevante Then el sistema registra la acción en el log de auditoría 
```

**Definition of Done**

* Auditoría persistida
* Accesible desde backoffice

***

### HU-E15-06 — Limitar el alcance de actuación del sistema

** Narrativa**

**Como** organización
**Quiero** limitar explícitamente qué puede y qué no puede hacer el sistema
**Para** evitar comportamientos inesperados.

**Valor esperado**

* Tipo de valor: **control**
* Outcome: la IA no se sale de su marco de actuación.

**Reglas de negocio**

* El sistema:
  * solo lee buzones configurados
  * solo responde a eventos permitidos
* No puede ejecutar acciones fuera de catálogo

**Criterios de aceptación**

* Acciones fuera de alcance son bloqueadas
* El intento queda registrado

**Gherkin**

```
Scenario: Acción fuera de alcance Given que el sistema intenta ejecutar una acción no permitida Then la bloquea And registra el intento 
```

**Definition of Done**

* Límites definidos
* Bloqueos activos

***

### HU-E15-07 — Activar y desactivar automatismos (kill switch)

** Narrativa**

**Como** organización
**Quiero** poder detener los automatismos del sistema
**Para** reaccionar ante incidencias o riesgos.

**Valor esperado**

* Tipo de valor: **seguridad operativa**
* Outcome: control total ante emergencias.

**Reglas de negocio**

* El kill switch:
  * detiene respuestas automáticas
  * no borra información
* Debe ser inmediato

**Criterios de aceptación**

* El sistema permite desactivar automatismos
* No se envían correos automáticos tras la activación

**Gherkin**

```
Scenario: Activación del kill switch Given que el usuario activa el kill switch When ocurre un evento Then el sistema no ejecuta acciones automáticas 
```

**Definition of Done**

* Kill switch operativo
* Comportamiento validado

***

### HU-E15-08 — Visualizar el estado de seguridad del sistema

** Narrativa**

**Como** equipo de responsabilidad / compliance
**Quiero** visualizar el estado de seguridad del sistema
**Para** asegurar que está operando dentro de los límites definidos.

**Valor esperado**

* Tipo de valor: **control ejecutivo**
* Outcome: confianza continua en el sistema.

**Reglas de negocio**

* El estado debe mostrar:
  * automatismos activos/inactivos
  * integraciones activas
  * alertas de seguridad

**Criterios de aceptación**

* El estado es visible en el backoffice
* La información está actualizada

**Gherkin**

```
Scenario: Visualización del estado de seguridad Given que el usuario accede al backoffice When revisa el estado de seguridad Then ve el estado actual del sistema 
```

**Definition of Done**

* Vista disponible
* Información fiable
