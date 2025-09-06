import React, { useEffect, useState } from "react";
import "../../modules/laws/Laws.css";
import { authHeader } from "../../utils/authHeader";

// arriba, define API primero
const isProd = import.meta.env.MODE === "production";
const API = isProd ? "" : (import.meta.env.VITE_API_URL ?? "http://localhost:4000");

// dentro del componente…
useEffect(() => {
  fetch(`${API}/api/controles/SOX`, { headers: { ...authHeader() } })
    .then((res) => res.json())
    .then((data) => {
      setControles(data);
      const respuestasIniciales = {};
      data.forEach((control) => {
        respuestasIniciales[control.clave] = "No";
      });
      setRespuestas(respuestasIniciales);
    });
}, []);

  const handleRespuesta = (clave, valor) => {
    setRespuestas({ ...respuestas, [clave]: valor });
  };

  const evaluarCumplimiento = () => {
    const total = controles.length;
    const siCumple = Object.values(respuestas).filter(r => r === "Sí").length;
    const porcentaje = Math.round((siCumple / total) * 100);

    let color = "";
    if (porcentaje >= 80) color = "green";
    else if (porcentaje >= 50) color = "orange";
    else color = "red";

    setResultado({ porcentaje, color });
  };

  return (
    <>

      <div className="page-container">
        <h2 style={{ color: "#7b2cbf" }}>Evaluación: <strong>SOX</strong></h2>

        {controles.map((control) => (
          <div key={control.clave} style={{ marginBottom: "10px" }}>
            <label>{control.pregunta}</label><br />
            <select
              value={respuestas[control.clave]}
              onChange={(e) => handleRespuesta(control.clave, e.target.value)}
            >
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
        ))}

        <button
          onClick={evaluarCumplimiento}
          style={{
            backgroundColor: "#ff6b00",
            color: "#fff",
            padding: "15px 30px",
            border: "none",
            borderRadius: "8px",
            marginTop: "20px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Evaluar Cumplimiento
        </button>

        {resultado && (
          <div style={{ marginTop: "30px" }}>
            <h3>
              Porcentaje de cumplimiento:{" "}
              <span style={{ color: resultado.color }}>{resultado.porcentaje}%</span>
            </h3>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: resultado.color,
                margin: "20px auto"
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SoxEvaluation;
