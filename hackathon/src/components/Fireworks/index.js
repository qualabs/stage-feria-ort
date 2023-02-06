import React, { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { particlesOptions } from './particles.js';

const  Fireworks = () => {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
      await container;
  }, []);

  return (
      <Particles id="tsparticles" options={particlesOptions} init={particlesInit} loaded={particlesLoaded} />
  );
}

export default Fireworks
