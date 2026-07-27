---
name: Dayflow
description: Una jornada que toma forma mediante decisiones deliberadas.
colors:
  vermilion-washi: "#D83C2E"
  vermilion-deep: "#B72D22"
  fold-white: "#F7F3EE"
  paper-grey: "#E6E2DA"
  sumi-black: "#1A1A1A"
  gold-marker: "#D4AF37"
typography:
  display:
    fontFamily: "Avenir Next, Avenir, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Avenir Next, Avenir, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.8rem)"
    fontWeight: 430
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Avenir Next, Avenir, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: "Avenir Next, Avenir, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  compact:
    fontFamily: "Avenir Next, Avenir, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Avenir Next Condensed, Arial Narrow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.12em"
  caption:
    fontFamily: "Avenir Next Condensed, Arial Narrow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  fold: "2px"
  control: "4px"
  action: "3px"
spacing:
  crease: "1px"
  unit: "8px"
  panel: "24px"
components:
  button-primary:
    backgroundColor: "{colors.vermilion-washi}"
    textColor: "{colors.fold-white}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-secondary:
    backgroundColor: "{colors.fold-white}"
    textColor: "{colors.vermilion-deep}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  task-sheet:
    backgroundColor: "{colors.fold-white}"
    textColor: "{colors.sumi-black}"
    rounded: "{rounded.fold}"
    padding: "12px"
---

# Design System: Dayflow

## Overview

**Creative North Star: “El día plegado”**

Dayflow trata cada jornada como una sola hoja que adquiere forma con cada decisión. El sistema toma del origami la secuencia, la precisión y la memoria de los pliegues: las tareas no son tarjetas intercambiables, sino fragmentos de una misma jornada que cambian de estado sin perder su lugar en el tiempo.

La interfaz es operativa, sobria y táctil. El lenguaje de papel aparece en superficies, líneas y transiciones; nunca sustituye etiquetas, controles conocidos ni jerarquía funcional.

**Key Characteristics:**

- Vermellón washi para las regiones de intención y foco.
- Papel claro, tinta sumi y líneas de pliegue para la información diaria.
- Un único punto dorado señala la acción o momento activo.
- Geometría cuadrada y diagonales funcionales, sin decoraciones temáticas.

## Colors

La paleta conserva el contraste de tinta sobre papel y reserva el vermellón para intención, navegación activa y foco.

### Primary

- **Vermellón washi** (#D83C2E): acción primaria, estado En foco y regiones de máxima intención.
- **Vermellón profundo** (#B72D22): estados activos y contraste sobre papel.

### Secondary

- **Punto de oro** (#D4AF37): indicador único de presente, energía elegida o progreso activo.

### Neutral

- **Blanco de pliegue** (#F7F3EE): superficie principal.
- **Gris papel** (#E6E2DA): planos secundarios y divisores.
- **Tinta sumi** (#1A1A1A): texto y controles.

**The One Gold Dot Rule.** El oro señala una sola cosa activa por región; nunca se dispersa como decoración.

## Typography

**Display Font:** Avenir Next con fallbacks de sistema.
**Body Font:** Avenir Next con fallbacks de sistema.
**Label Font:** Avenir Next Condensed o Arial Narrow.

La tipografía es humanista y precisa. Los títulos tienen aire de instrucción editorial; las etiquetas horarias y de estado son compactas, numeradas y fáciles de escanear.

## Layout

La retícula nace de una hoja dividida por pliegues: regiones rectangulares, márgenes numerados y alineaciones estrictas. En escritorio, agenda y bandeja de tareas comparten una sola superficie. En móvil, esa hoja se repliega en una secuencia vertical: foco, agenda y tareas.

La densidad es deliberada. La separación se comunica con reglas, cambio de papel y alineación antes que con tarjetas flotantes.

## Elevation & Depth

El sistema es plano por defecto. La profundidad aparece solo durante la manipulación mediante una sombra corta y direccional, como una esquina de papel levantada. Los estados en reposo se diferencian con bordes y planos tonales.

## Shapes

Las esquinas son casi cuadradas. Los cortes diagonales y las líneas de pliegue pueden señalar movimiento o estado, pero no alteran la legibilidad ni crean controles ambiguos. Los círculos se reservan para el marcador dorado y selectores discretos.

## Components

### Buttons

- Primario vermellón, rectangular y directo.
- Secundario de papel con borde vermellón.
- Foco visible mediante doble contorno de tinta y blanco, nunca solo color.

### Cards / Containers

- Las tareas son hojas o tiras integradas en la retícula.
- `Pendiente` permanece en papel claro; `En foco` usa vermellón; `Hecho` reduce contraste sin desaparecer.
- La sombra solo aparece al arrastrar o elevar un panel modal.

### Inputs / Fields

- Fondo de papel, borde fino de tinta y etiqueta persistente.
- Error mediante texto explícito y trazo vermellón profundo.

### Navigation

- Dos destinos: Hoy y Semana.
- El destino activo se reconoce por campo vermellón, texto y marcador, no por un icono aislado.

### Crease Timeline

La agenda es una línea vertical numerada. Cada tarea se fija a su hora mediante una unión visible; moverla conserva su identidad y cambia la geometría de su pliegue.

## Do's and Don'ts

### Do:

- **Do** mantener controles y estados reconocibles incluso cuando adopten lenguaje de papel.
- **Do** usar el vermellón a escala de región para señalar foco e intención.
- **Do** hacer que cada transición explique un cambio de estado o posición.

### Don't:

- **Don't** convertir cada dato en una tarjeta redondeada y flotante.
- **Don't** usar grullas, caracteres japoneses o iconografía temática como decoración.
- **Don't** esconder acciones esenciales detrás del arrastre.
- **Don't** añadir gamificación, IA, colaboración o métricas no validadas.
