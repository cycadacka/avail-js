import Scene from 'core/scene';
import Component from 'core/component';
import System from 'core/system';

import image from 'loader/loadImage';

const loader = {
  image,
};

import * as mathf from 'math/math';
import Vector2D from 'math/vector2d';
import Matrix3x3 from 'math/matrix3x3';

const math = Object.assign(mathf, {
  Vector2D,
  Matrix3x3,
});

import Transform from 'modules/transform';
// Physics //
import Rigidbody from 'modules/physics/rigidbody';
// Shapes //
import Ellipse from 'modules/shapes/ellipse';
import Polygon from 'modules/shapes/polygon';
import Rect from 'modules/shapes/rect';
import PolygonMaterial from 'modules/shapes/polygon-material';
import PolygonRenderer from 'modules/shapes/polygon-renderer';
import PolygonCollider from 'modules/shapes/polygon-collider';
import PolygonCollision from 'modules/shapes/polygon-collision';
// Sprite //
import Sprite from 'modules/sprite/sprite';
import SpriteRenderer from 'modules/sprite/sprite-renderer';
import CollisionListener from '../src/modules/collision-listener';

const modules = {
  Transform,
  CollisionListener,
  physics: {
    Rigidbody,
  },
  shapes: {
    Ellipse,
    Rect,
    Polygon,
    PolygonMaterial,
    PolygonRenderer,
    PolygonCollider,
    PolygonCollision,
  },
  sprite: {
    Sprite,
    SpriteRenderer,
  },
};

export { Scene, Component, System, loader, math, modules };
