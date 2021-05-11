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
import Dirtyable from 'common/dirtyable';

// Physics //
import RigidBody from 'physics/rigid-body';

const physics = {
  RigidBody,
};

// Shapes //
import Ellipse from 'shapes/ellipse';
import Polygon from 'shapes/polygon';
import Rect from 'shapes/rect';
import PolygonMaterial from 'shapes/polygon-material';
import PolygonRenderer from 'shapes/polygon-renderer';

const shapes = {
  Ellipse,
  Rect,
  Polygon,
  PolygonMaterial,
  PolygonRenderer,
};

// Collision //
import CollisionMatrix from 'collision/collision-matrix';
import PolygonCollider from 'collision/polygon-collider';
import PolygonCollision from 'collision/polygon-collision';

const collision = {
  CollisionMatrix,
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
  Dirtyable,
  physics,
  shapes,
  collision,
  sprite,
};
