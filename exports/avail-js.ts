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
// Physics //
import Rigidbody from '../src/modules/physics/rigidbody';
// Shapes //
import Ellipse from '../src/modules/shapes/ellipse';
import Rect from '../src/modules/shapes/polygon';
import Polygon from '../src/modules/shapes/rect';
import PolygonMaterial from '../src/modules/shapes/polygon-material';
import PolygonRenderer from '../src/modules/shapes/polygon-renderer';
import PolygonCollider from '../src/modules/shapes/polygon-collider';
import PolygonCollisionManager from '../src/modules/shapes/polygon-collision';
// Sprite //
import Sprite from '../src/modules/sprite/sprite'
import SpriteRenderer from '../src/modules/sprite/sprite-renderer';

const modules = {
  Transform,
  physics: {
    Rigidbody
  },
  shapes: {
    Ellipse,
    Rect,
    Polygon,
    PolygonMaterial,
    PolygonRenderer,
    PolygonCollider,
    PolygonCollisionManager,
  },
  sprite: {
    Sprite,
    SpriteRenderer,
  },
};

export {
  Scene,
  Component,
  System,
  loader,
  math,
  modules,
};
