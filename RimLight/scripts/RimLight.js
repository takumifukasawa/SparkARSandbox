/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//==============================================================================

const Shaders = require('Shaders');
const Reactive = require('Reactive');
const Materials = require('Materials');

const localPosition = Shaders.vertexAttribute({ variableName: Shaders.VertexAttribute.POSITION });
const localNormal = Shaders.vertexAttribute({ variableName: Shaders.VertexAttribute.NORMAL });

const mvMatrix = Shaders.vertexTransform({ variableName: Shaders.BuiltinUniform.MV_MATRIX });
const normalMatrix = Shaders.vertexTransform({ variableName: Shaders.BuiltinUniform.NORMAL_MATRIX });

const normal = normalMatrix.mul(localNormal).normalize();

const position = Reactive.pack4(
  localPosition.x,
  localPosition.y,
  localPosition.z,
  1.
);

const mvPosition = mvMatrix.mul(position);

const viewPosition = mvPosition.mul(-1);
const viewDir = Reactive.normalize(Reactive.pack3(viewPosition.x, viewPosition.y, viewPosition.z));

const dotNV = Reactive.dot(viewDir, normal);
const fresnel = Reactive.pow(Reactive.sub(1, Reactive.clamp(dotNV, 0, 1)), 2);

const emissiveColor = Reactive.pack4(
  fresnel, fresnel, fresnel, 1.
);

const material = Materials.get('RimLight');
material.setTextureSlot(Shaders.DefaultMaterialTextures.EMISSIVE, emissiveColor);