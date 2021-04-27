import Scene from './core/scene';
import Component from './core/component';
import System from './core/system';

// loader/**
import loadImage from './loader/loadImage';

const loader = {
  image: loadImage,
};


// math/**
import * as mathf from './math/math';
import Vector2D from './math/vector2d';
import Matrix3x3 from './math/matrix3x3';

const math = Object.assign(mathf, {
  Vector2D,
  Matrix3x3,
});

// modules/**
import Transform from './modules/transform';
import Rigidbody2D from './modules/physics/rigidbody2d';
import Ellipse from './modules/shapes/ellipse';
import Rect from './modules/shapes/rect';
import SimplePolygon from './modules/shapes/simple-polygon';
import PolygonMaterial from './modules/shapes/rendering/polygon-material';
import PolygonRenderer from './modules/shapes/rendering/polygon-renderer';
import PolygonCollider from './modules/shapes/collision/polygon-collider';
import PolygonCollision from './modules/shapes/collision/polygon-collision';
import Sprite from './modules/sprite/sprite';
import SpriteRenderer from './modules/sprite/sprite-renderer';

const modules = {
  Transform,
  physics: {
    Rigidbody2D
  },
  shapes: {
    Ellipse,
    Rect,
    SimplePolygon,
    Material: PolygonMaterial,
    Renderer: PolygonRenderer,
    Collider: PolygonCollider,
    Collision: PolygonCollision,
  },
  sprite: {
    Sprite,
    Renderer: SpriteRenderer,
  }
};

export {
  loader,
  math,
  modules,
  // core/**
  Scene,
  Component,
  System,
};
