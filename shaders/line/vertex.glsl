attribute vec3 position1;
attribute vec4 aSeed;

uniform float uRandom;
uniform vec4  uRandomVec4;
uniform float uFocalDepth;
uniform float uBokehStrength;
uniform float uMinimumLineSize;
uniform float uFocalPowerFunction;
uniform float uTime;
uniform float uDistanceAttenuation;

uniform sampler2D uBokehTexture;

varying vec3 vColor;
varying vec2 vUv;

//  the function below is hash12 from https://www.shadertoy.com/view/4djSRW - I just renamed it nrand()
//  sin based random functions wont work
float nrand(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float n1rand( vec2 n )
{
	float t = fract( uTime );
	float nrnd0 = nrand( n + 0.7*t );
	return nrnd0;
}

void main() {
    float o1 = n1rand( vec2(uRandom + aSeed.x, uRandomVec4.x) );

    float t = o1; 
    vec3 positiont = position * (1.0 - t) + position1 * t;
    vec3 viewSpacePositionT = (modelViewMatrix * vec4(positiont, 1.0)).xyz;

     vec4 projectedPosition = projectionMatrix * vec4(viewSpacePositionT, 1.0);
    gl_Position = projectedPosition;

    gl_PointSize = 2.0;
    vUv = uv;
}