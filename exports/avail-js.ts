import Scene from "core/scene";
import Component from "core/component";

import image from "loader/load-image";

const loader = {
  image,
};

import * as mathf from "math/math";
import Vector2D from "math/vector2d";
import Matrix3x3 from "math/matrix3x3";

const math = Object.assign(mathf, {
  Vector2D,
  Matrix3x3,
});

// Common //
import Transform from "common/transform";
import Dirty from 'common/dirty';

// Physics //
import Rigidbody from "physics/rigidbody";

const physics = {
  Rigidbody,
};

// Shapes //
import Ellipse from "shapes/ellipse";
import Polygon from "shapes/polygon";
import Rect from "shapes/rect";
import PolygonMaterial from "shapes/polygon-material";
import PolygonRenderer from "shapes/polygon-renderer";

const shapes = {
  Ellipse,
  Rect,
  Polygon,
  PolygonMaterial,
  PolygonRenderer,
};

// Collision //
import PolygonCollider from "collision/polygon-collider";
import PolygonCollision from "collision/polygon-collision";

const collision = {
  PolygonCollider,
  PolygonCollision,
};

// Sprite //
import Sprite from "sprite/sprite";
import SpriteRenderer from "sprite/sprite-renderer";

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
  Dirty,
  physics,
  shapes,
  collision,
  sprite,
};
