import Scene from '../src/core/scene';
import Component from '../src/core/component';
import System from '../src/core/system';

import image from '../src/loader/loadImage';

const loader = {
  image,
};

import * as mathf from '../src/math/math';
import Vector2D from '../src/math/vector2d';
import Matrix3x3 from '../src/math/matrix3x3';

const math = Object.assign(mathf, {
  Vector2D,
  Matrix3x3,
});

import Transform from '../src/modules/transform';

const modules = {
  Transform,
};

export {
  Scene,
  Component,
  System,
  loader,
  math,
  modules,
};
