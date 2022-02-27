import Scene from 'core/scene';
import Component from 'core/component';

import image from 'loader/load-image';

const loader = {
  image,
};

import * as mathPlus from 'math/math';
import Vector2D from 'math/vector2d';
import Matrix3x3 from 'math/matrix3x3';

const math = Object.assign(mathPlus, {
  Vector2D,
  Matrix3x3,
});

// Common //
import Transform from 'common/transform';
import InputSystem from 'common/input-system';
import Dirtyable from 'common/dirtyable';

// Shapes //
import ConvexPolygon from 'shapes/convex-polygon';
import Ellipse from 'shapes/ellipse';
import Polygon from 'shapes/polygon';
import Rect from 'shapes/rect';
import PolygonMaterial from 'shapes/polygon-material';
import PolygonRenderer from 'shapes/polygon-renderer';

const shapes = {
  ConvexPolygon,
  Ellipse,
  Rect,
  Polygon,
  PolygonMaterial,
  PolygonRenderer,
};

// Collision //
import LayerCollisionMatrix from 'collision/layer-collision-matrix';
import PolygonCollider from 'collision/polygon-collider';
import PolygonCollision from 'collision/polygon-collision';

const collision = {
  LayerCollisionMatrix,
  PolygonCollider,
  PolygonCollision,
};

// Sprite //
import Sprite from 'sprite/sprite';
import SpriteRenderer from 'sprite/sprite-renderer';

const sprite = {
  Sprite,
  SpriteRenderer,
};

export {
  Scene,
  Component,
  loader,
  math,
  Transform,
  InputSystem,
  Dirtyable,
  shapes,
  collision,
  sprite,
};
