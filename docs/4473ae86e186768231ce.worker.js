!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t,r){(function(t){(function(){var r,n,i,a,o,s;"undefined"!=typeof performance&&null!==performance&&performance.now?e.exports=function(){return performance.now()}:null!=t&&t.hrtime?(e.exports=function(){return(r()-o)/1e6},n=t.hrtime,a=(r=function(){var e;return 1e9*(e=n())[0]+e[1]})(),s=1e9*t.uptime(),o=a-s):Date.now?(e.exports=function(){return Date.now()-i},i=Date.now()):(e.exports=function(){return(new Date).getTime()-i},i=(new Date).getTime())}).call(this)}).call(this,r(2))},function(e,t,r){var n;!function(){"use strict";var i=.5*(Math.sqrt(3)-1),a=(3-Math.sqrt(3))/6,o=1/6,s=(Math.sqrt(5)-1)/4,u=(5-Math.sqrt(5))/20;function c(e){var t;t="function"==typeof e?e:e?function(){var e=0,t=0,r=0,n=1,i=(a=4022871197,function(e){e=e.toString();for(var t=0;t<e.length;t++){var r=.02519603282416938*(a+=e.charCodeAt(t));r-=a=r>>>0,a=(r*=a)>>>0,a+=4294967296*(r-=a)}return 2.3283064365386963e-10*(a>>>0)});var a;e=i(" "),t=i(" "),r=i(" ");for(var o=0;o<arguments.length;o++)(e-=i(arguments[o]))<0&&(e+=1),(t-=i(arguments[o]))<0&&(t+=1),(r-=i(arguments[o]))<0&&(r+=1);return i=null,function(){var i=2091639*e+2.3283064365386963e-10*n;return e=t,t=r,r=i-(n=0|i)}}(e):Math.random,this.p=l(t),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(var r=0;r<512;r++)this.perm[r]=this.p[255&r],this.permMod12[r]=this.perm[r]%12}function l(e){var t,r=new Uint8Array(256);for(t=0;t<256;t++)r[t]=t;for(t=0;t<255;t++){var n=t+~~(e()*(256-t)),i=r[t];r[t]=r[n],r[n]=i}return r}c.prototype={grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),grad4:new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]),noise2D:function(e,t){var r,n,o=this.permMod12,s=this.perm,u=this.grad3,c=0,l=0,h=0,f=(e+t)*i,v=Math.floor(e+f),p=Math.floor(t+f),g=(v+p)*a,d=e-(v-g),y=t-(p-g);d>y?(r=1,n=0):(r=0,n=1);var b=d-r+a,m=y-n+a,k=d-1+2*a,w=y-1+2*a,M=255&v,x=255&p,z=.5-d*d-y*y;if(z>=0){var T=3*o[M+s[x]];c=(z*=z)*z*(u[T]*d+u[T+1]*y)}var I=.5-b*b-m*m;if(I>=0){var N=3*o[M+r+s[x+n]];l=(I*=I)*I*(u[N]*b+u[N+1]*m)}var O=.5-k*k-w*w;if(O>=0){var E=3*o[M+1+s[x+1]];h=(O*=O)*O*(u[E]*k+u[E+1]*w)}return 70*(c+l+h)},noise3D:function(e,t,r){var n,i,a,s,u,c,l,h,f,v,p=this.permMod12,g=this.perm,d=this.grad3,y=(e+t+r)*(1/3),b=Math.floor(e+y),m=Math.floor(t+y),k=Math.floor(r+y),w=(b+m+k)*o,M=e-(b-w),x=t-(m-w),z=r-(k-w);M>=x?x>=z?(u=1,c=0,l=0,h=1,f=1,v=0):M>=z?(u=1,c=0,l=0,h=1,f=0,v=1):(u=0,c=0,l=1,h=1,f=0,v=1):x<z?(u=0,c=0,l=1,h=0,f=1,v=1):M<z?(u=0,c=1,l=0,h=0,f=1,v=1):(u=0,c=1,l=0,h=1,f=1,v=0);var T=M-u+o,I=x-c+o,N=z-l+o,O=M-h+2*o,E=x-f+2*o,A=z-v+2*o,S=M-1+.5,D=x-1+.5,j=z-1+.5,P=255&b,_=255&m,C=255&k,F=.6-M*M-x*x-z*z;if(F<0)n=0;else{var U=3*p[P+g[_+g[C]]];n=(F*=F)*F*(d[U]*M+d[U+1]*x+d[U+2]*z)}var L=.6-T*T-I*I-N*N;if(L<0)i=0;else{var q=3*p[P+u+g[_+c+g[C+l]]];i=(L*=L)*L*(d[q]*T+d[q+1]*I+d[q+2]*N)}var R=.6-O*O-E*E-A*A;if(R<0)a=0;else{var Y=3*p[P+h+g[_+f+g[C+v]]];a=(R*=R)*R*(d[Y]*O+d[Y+1]*E+d[Y+2]*A)}var G=.6-S*S-D*D-j*j;if(G<0)s=0;else{var X=3*p[P+1+g[_+1+g[C+1]]];s=(G*=G)*G*(d[X]*S+d[X+1]*D+d[X+2]*j)}return 32*(n+i+a+s)},noise4D:function(e,t,r,n){var i,a,o,c,l,h,f,v,p,g,d,y,b,m,k,w,M,x=this.perm,z=this.grad4,T=(e+t+r+n)*s,I=Math.floor(e+T),N=Math.floor(t+T),O=Math.floor(r+T),E=Math.floor(n+T),A=(I+N+O+E)*u,S=e-(I-A),D=t-(N-A),j=r-(O-A),P=n-(E-A),_=0,C=0,F=0,U=0;S>D?_++:C++,S>j?_++:F++,S>P?_++:U++,D>j?C++:F++,D>P?C++:U++,j>P?F++:U++;var L=S-(h=_>=3?1:0)+u,q=D-(f=C>=3?1:0)+u,R=j-(v=F>=3?1:0)+u,Y=P-(p=U>=3?1:0)+u,G=S-(g=_>=2?1:0)+2*u,X=D-(d=C>=2?1:0)+2*u,B=j-(y=F>=2?1:0)+2*u,V=P-(b=U>=2?1:0)+2*u,H=S-(m=_>=1?1:0)+3*u,J=D-(k=C>=1?1:0)+3*u,K=j-(w=F>=1?1:0)+3*u,W=P-(M=U>=1?1:0)+3*u,Q=S-1+4*u,Z=D-1+4*u,$=j-1+4*u,ee=P-1+4*u,te=255&I,re=255&N,ne=255&O,ie=255&E,ae=.6-S*S-D*D-j*j-P*P;if(ae<0)i=0;else{var oe=x[te+x[re+x[ne+x[ie]]]]%32*4;i=(ae*=ae)*ae*(z[oe]*S+z[oe+1]*D+z[oe+2]*j+z[oe+3]*P)}var se=.6-L*L-q*q-R*R-Y*Y;if(se<0)a=0;else{var ue=x[te+h+x[re+f+x[ne+v+x[ie+p]]]]%32*4;a=(se*=se)*se*(z[ue]*L+z[ue+1]*q+z[ue+2]*R+z[ue+3]*Y)}var ce=.6-G*G-X*X-B*B-V*V;if(ce<0)o=0;else{var le=x[te+g+x[re+d+x[ne+y+x[ie+b]]]]%32*4;o=(ce*=ce)*ce*(z[le]*G+z[le+1]*X+z[le+2]*B+z[le+3]*V)}var he=.6-H*H-J*J-K*K-W*W;if(he<0)c=0;else{var fe=x[te+m+x[re+k+x[ne+w+x[ie+M]]]]%32*4;c=(he*=he)*he*(z[fe]*H+z[fe+1]*J+z[fe+2]*K+z[fe+3]*W)}var ve=.6-Q*Q-Z*Z-$*$-ee*ee;if(ve<0)l=0;else{var pe=x[te+1+x[re+1+x[ne+1+x[ie+1]]]]%32*4;l=(ve*=ve)*ve*(z[pe]*Q+z[pe+1]*Z+z[pe+2]*$+z[pe+3]*ee)}return 27*(i+a+o+c+l)}},c._buildPermutationTable=l,void 0===(n=function(){return c}.call(t,r,t,e))||(e.exports=n),t.SimplexNoise=c,e.exports=c}()},function(e,t){var r,n,i=e.exports={};function a(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function s(e){if(r===setTimeout)return setTimeout(e,0);if((r===a||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:a}catch(e){r=a}try{n="function"==typeof clearTimeout?clearTimeout:o}catch(e){n=o}}();var u,c=[],l=!1,h=-1;function f(){l&&u&&(l=!1,u.length?c=u.concat(c):h=-1,c.length&&v())}function v(){if(!l){var e=s(f);l=!0;for(var t=c.length;t;){for(u=c,c=[];++h<t;)u&&u[h].run();h=-1,t=c.length}u=null,l=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===o||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function g(){}i.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];c.push(new p(e,t)),1!==c.length||l||s(v)},p.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=g,i.addListener=g,i.once=g,i.off=g,i.removeListener=g,i.removeAllListeners=g,i.emit=g,i.prependListener=g,i.prependOnceListener=g,i.listeners=function(e){return[]},i.binding=function(e){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},function(e,t,r){"use strict";r.r(t);var n=r(1),i=r.n(n),a=function(){function e(t){this._value=NaN,this._seed="string"==typeof t?this.hashCode(t):"number"==typeof t?this.getSafeSeed(t):this.getSafeSeed(e.MIN+Math.floor((e.MAX-e.MIN)*Math.random())),this.reset()}return e.prototype.next=function(t,r){return void 0===t&&(t=0),void 0===r&&(r=1),this.recalculate(),this.map(this._value,e.MIN,e.MAX,t,r)},e.prototype.nextInt=function(t,r){return void 0===t&&(t=10),void 0===r&&(r=100),this.recalculate(),Math.floor(this.map(this._value,e.MIN,e.MAX,t,r+1))},e.prototype.nextString=function(e,t){void 0===e&&(e=16),void 0===t&&(t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");for(var r="";r.length<e;)r+=this.nextChar(t);return r},e.prototype.nextChar=function(e){return void 0===e&&(e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),this.recalculate(),e.substr(this.nextInt(0,e.length-1),1)},e.prototype.nextArrayItem=function(e){return this.recalculate(),e[this.nextInt(0,e.length-1)]},e.prototype.nextBoolean=function(){return this.recalculate(),this._value>.5},e.prototype.skip=function(e){for(void 0===e&&(e=1);e-- >0;)this.recalculate()},e.prototype.reset=function(){this._value=this._seed},e.prototype.recalculate=function(){this._value=this.xorshift(this._value)},e.prototype.xorshift=function(e){return e^=e<<13,e^=e>>17,e^=e<<5},e.prototype.map=function(e,t,r,n,i){return(e-t)/(r-t)*(i-n)+n},e.prototype.hashCode=function(e){var t=0;if(e)for(var r=e.length,n=0;n<r;n++)t=(t<<5)-t+e.charCodeAt(n),t|=0,t=this.xorshift(t);return this.getSafeSeed(t)},e.prototype.getSafeSeed=function(e){return 0===e?1:e},e.MIN=-2147483648,e.MAX=2147483647,e}(),o=r(0),s=r.n(o);function u(e,t,r,n){var i,a=e.size,o=e.tiles,s=e.things;switch(n){case 0:case 1:s[(r-1)*a+t-1]=G,s[(r-1)*a+t]=G,s[(r-1)*a+t+1]=G,s[r*a+t-1]=G,o[i=r*a+t]!==D&&(o[i]=L,s[i]=G),s[r*a+t+1]=G,s[(r+1)*a+t-1]=G,s[(r+1)*a+t]=G,s[(r+1)*a+t+1]=G;break;case 2:s[(r-1)*a+t-1]=G,s[(r-1)*a+t]=G,s[(r-1)*a+t+1]=G,s[(r-1)*a+t+2]=G,s[r*a+t-1]=G,o[i=r*a+t]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+1]!==D&&(o[i]=L,s[i]=G),s[r*a+t+2]=G,s[(r+1)*a+t-1]=G,s[(r+1)*a+t]=G,s[(r+1)*a+t+1]=G,s[(r+1)*a+t+2]=G;break;case 3:s[(r-3)*a+t]=G,s[(r-3)*a+t+1]=G,s[(r-2)*a+t-1]=G,s[(r-2)*a+t]=G,s[(r-2)*a+t+1]=G,s[(r-2)*a+t+2]=G,s[(r-1)*a+t-2]=G,s[(r-1)*a+t-1]=G,o[i=(r-1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r-1)*a+t+2]=G,s[(r-1)*a+t+3]=G,s[r*a+t-2]=G,s[r*a+t-1]=G,o[i=r*a+t]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+1]!==D&&(o[i]=L,s[i]=G),s[r*a+t+2]=G,s[r*a+t+3]=G,s[(r+1)*a+t-1]=G,s[(r+1)*a+t]=G,s[(r+1)*a+t+1]=G,s[(r+1)*a+t+2]=G,s[(r+2)*a+t]=G,s[(r+2)*a+t+1]=G;break;case 4:s[(r-3)*a+t-1]=G,s[(r-3)*a+t]=G,s[(r-3)*a+t+1]=G,s[(r-2)*a+t-2]=G,s[(r-2)*a+t-1]=G,s[(r-2)*a+t]=G,s[(r-2)*a+t+1]=G,s[(r-2)*a+t+2]=G,s[(r-1)*a+t-3]=G,s[(r-1)*a+t-2]=G,o[i=(r-1)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r-1)*a+t+2]=G,s[(r-1)*a+t+3]=G,s[r*a+t-3]=G,s[r*a+t-2]=G,o[i=r*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+1]!==D&&(o[i]=L,s[i]=G),s[r*a+t+2]=G,s[r*a+t+3]=G,s[(r+1)*a+t-2]=G,s[(r+1)*a+t-1]=G,s[(r+1)*a+t]=G,s[(r+1)*a+t+1]=G,s[(r+1)*a+t+2]=G,s[(r+2)*a+t-1]=G,s[(r+2)*a+t]=G,s[(r+2)*a+t+1]=G;break;case 5:s[(r-3)*a+t-1]=G,s[(r-3)*a+t]=G,s[(r-3)*a+t+1]=G,s[(r-2)*a+t-2]=G,s[(r-2)*a+t-1]=G,s[(r-2)*a+t]=G,s[(r-2)*a+t+1]=G,s[(r-2)*a+t+2]=G,s[(r-1)*a+t-3]=G,s[(r-1)*a+t-2]=G,o[i=(r-1)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r-1)*a+t+2]=G,s[(r-1)*a+t+3]=G,s[r*a+t-3]=G,s[r*a+t-2]=G,o[i=r*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+1]!==D&&(o[i]=L,s[i]=G),s[r*a+t+2]=G,s[r*a+t+3]=G,s[(r+1)*a+t-3]=G,s[(r+1)*a+t-2]=G,o[i=(r+1)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r+1)*a+t+2]=G,s[(r+1)*a+t+3]=G,s[(r+2)*a+t-2]=G,s[(r+2)*a+t-1]=G,s[(r+2)*a+t]=G,s[(r+2)*a+t+1]=G,s[(r+2)*a+t+2]=G,s[(r+3)*a+t-1]=G,s[(r+3)*a+t]=G,s[(r+3)*a+t+1]=G;break;case 6:s[(r-4)*a+t-1]=G,s[(r-4)*a+t]=G,s[(r-4)*a+t+1]=G,s[(r-3)*a+t-2]=G,s[(r-3)*a+t-1]=G,s[(r-3)*a+t]=G,s[(r-3)*a+t+1]=G,s[(r-3)*a+t+2]=G,s[(r-2)*a+t-3]=G,s[(r-2)*a+t-2]=G,o[i=(r-2)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r-2)*a+t+2]=G,s[(r-2)*a+t+3]=G,s[(r-1)*a+t-4]=G,s[(r-1)*a+t-3]=G,o[i=(r-1)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+2]!==D&&(o[i]=L,s[i]=G),s[(r-1)*a+t+3]=G,s[(r-1)*a+t+4]=G,s[r*a+t-4]=G,s[r*a+t-3]=G,o[i=r*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+2]!==D&&(o[i]=L,s[i]=G),s[r*a+t+3]=G,s[r*a+t+4]=G,s[(r+1)*a+t-4]=G,s[(r+1)*a+t-3]=G,o[i=(r+1)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+2]!==D&&(o[i]=L,s[i]=G),s[(r+1)*a+t+3]=G,s[(r+1)*a+t+4]=G,s[(r+2)*a+t-3]=G,s[(r+2)*a+t-2]=G,o[i=(r+2)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r+2)*a+t+2]=G,s[(r+2)*a+t+3]=G,s[(r+3)*a+t-2]=G,s[(r+3)*a+t-1]=G,s[(r+3)*a+t]=G,s[(r+3)*a+t+1]=G,s[(r+3)*a+t+2]=G,s[(r+4)*a+t-1]=G,s[(r+4)*a+t]=G,s[(r+4)*a+t+1]=G;break;case 7:s[(r-5)*a+t-1]=G,s[(r-5)*a+t]=G,s[(r-5)*a+t+1]=G,s[(r-4)*a+t-2]=G,s[(r-4)*a+t-1]=G,s[(r-4)*a+t]=G,s[(r-4)*a+t+1]=G,s[(r-4)*a+t+2]=G,s[(r-3)*a+t-3]=G,s[(r-3)*a+t-2]=G,o[i=(r-3)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-3)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-3)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r-3)*a+t+2]=G,s[(r-3)*a+t+3]=G,s[(r-2)*a+t-4]=G,s[(r-2)*a+t-3]=G,o[i=(r-2)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t+2]!==D&&(o[i]=L,s[i]=G),s[(r-2)*a+t+3]=G,s[(r-2)*a+t+4]=G,s[(r-1)*a+t-5]=G,s[(r-1)*a+t-4]=G,o[i=(r-1)*a+t-3]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+2]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+3]!==D&&(o[i]=L,s[i]=G),s[(r-1)*a+t+4]=G,s[(r-1)*a+t+5]=G,s[r*a+t-5]=G,s[r*a+t-4]=G,o[i=r*a+t-3]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+2]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+3]!==D&&(o[i]=L,s[i]=G),s[r*a+t+4]=G,s[r*a+t+5]=G,s[(r+1)*a+t-5]=G,s[(r+1)*a+t-4]=G,o[i=(r+1)*a+t-3]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+2]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+3]!==D&&(o[i]=L,s[i]=G),s[(r+1)*a+t+4]=G,s[(r+1)*a+t+5]=G,s[(r+2)*a+t-4]=G,s[(r+2)*a+t-3]=G,o[i=(r+2)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t+2]!==D&&(o[i]=L,s[i]=G),s[(r+2)*a+t+3]=G,s[(r+2)*a+t+4]=G,s[(r+3)*a+t-3]=G,s[(r+3)*a+t-2]=G,o[i=(r+3)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+3)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+3)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r+3)*a+t+2]=G,s[(r+3)*a+t+3]=G,s[(r+4)*a+t-2]=G,s[(r+4)*a+t-1]=G,s[(r+4)*a+t]=G,s[(r+4)*a+t+1]=G,s[(r+4)*a+t+2]=G,s[(r+5)*a+t-1]=G,s[(r+5)*a+t]=G,s[(r+5)*a+t+1]=G;break;case 8:s[(r-6)*a+t-1]=G,s[(r-6)*a+t]=G,s[(r-6)*a+t+1]=G,s[(r-5)*a+t-3]=G,s[(r-5)*a+t-2]=G,s[(r-5)*a+t-1]=G,s[(r-5)*a+t]=G,s[(r-5)*a+t+1]=G,s[(r-5)*a+t+2]=G,s[(r-5)*a+t+3]=G,s[(r-4)*a+t-4]=G,s[(r-4)*a+t-3]=G,s[(r-4)*a+t-2]=G,o[i=(r-4)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-4)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-4)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r-4)*a+t+2]=G,s[(r-4)*a+t+3]=G,s[(r-4)*a+t+4]=G,s[(r-3)*a+t-5]=G,s[(r-3)*a+t-4]=G,s[(r-3)*a+t-3]=G,o[i=(r-3)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r-3)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-3)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-3)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r-3)*a+t+2]!==D&&(o[i]=L,s[i]=G),s[(r-3)*a+t+3]=G,s[(r-3)*a+t+4]=G,s[(r-3)*a+t+5]=G,s[(r-2)*a+t-5]=G,s[(r-2)*a+t-4]=G,o[i=(r-2)*a+t-3]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t+2]!==D&&(o[i]=L,s[i]=G),o[i=(r-2)*a+t+3]!==D&&(o[i]=L,s[i]=G),s[(r-2)*a+t+4]=G,s[(r-2)*a+t+5]=G,s[(r-1)*a+t-6]=G,s[(r-1)*a+t-5]=G,o[i=(r-1)*a+t-4]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t-3]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+2]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+3]!==D&&(o[i]=L,s[i]=G),o[i=(r-1)*a+t+4]!==D&&(o[i]=L,s[i]=G),s[(r-1)*a+t+5]=G,s[(r-1)*a+t+6]=G,s[r*a+t-6]=G,s[r*a+t-5]=G,o[i=r*a+t-4]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t-3]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+2]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+3]!==D&&(o[i]=L,s[i]=G),o[i=r*a+t+4]!==D&&(o[i]=L,s[i]=G),s[r*a+t+5]=G,s[r*a+t+6]=G,s[(r+1)*a+t-6]=G,s[(r+1)*a+t-5]=G,o[i=(r+1)*a+t-4]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t-3]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+2]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+3]!==D&&(o[i]=L,s[i]=G),o[i=(r+1)*a+t+4]!==D&&(o[i]=L,s[i]=G),s[(r+1)*a+t+5]=G,s[(r+1)*a+t+6]=G,s[(r+2)*a+t-5]=G,s[(r+2)*a+t-4]=G,o[i=(r+2)*a+t-3]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t+2]!==D&&(o[i]=L,s[i]=G),o[i=(r+2)*a+t+3]!==D&&(o[i]=L,s[i]=G),s[(r+2)*a+t+4]=G,s[(r+2)*a+t+5]=G,s[(r+3)*a+t-5]=G,s[(r+3)*a+t-4]=G,s[(r+3)*a+t-3]=G,o[i=(r+3)*a+t-2]!==D&&(o[i]=L,s[i]=G),o[i=(r+3)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+3)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+3)*a+t+1]!==D&&(o[i]=L,s[i]=G),o[i=(r+3)*a+t+2]!==D&&(o[i]=L,s[i]=G),s[(r+3)*a+t+3]=G,s[(r+3)*a+t+4]=G,s[(r+3)*a+t+5]=G,s[(r+4)*a+t-4]=G,s[(r+4)*a+t-3]=G,s[(r+4)*a+t-2]=G,o[i=(r+4)*a+t-1]!==D&&(o[i]=L,s[i]=G),o[i=(r+4)*a+t]!==D&&(o[i]=L,s[i]=G),o[i=(r+4)*a+t+1]!==D&&(o[i]=L,s[i]=G),s[(r+4)*a+t+2]=G,s[(r+4)*a+t+3]=G,s[(r+4)*a+t+4]=G,s[(r+5)*a+t-3]=G,s[(r+5)*a+t-2]=G,s[(r+5)*a+t-1]=G,s[(r+5)*a+t]=G,s[(r+5)*a+t+1]=G,s[(r+5)*a+t+2]=G,s[(r+5)*a+t+3]=G,s[(r+6)*a+t-1]=G,s[(r+6)*a+t]=G,s[(r+6)*a+t+1]=G;break;default:throw new Error("Unhandled width: "+n)}}function c(e,t,r,n,i,a,o,s){var u,c,l,h,f,v,p=!0,g=!1,d=s.width,y=s.height,b=s.condition,m=s.outside,k=i*d;if(0!==r[k+n])return null;if(l=i-1,h=i+1,u=n-1,c=n+1,f=0,n>0?(f|=i>0?b(t[k+n])<<3:m<<3,f|=h<y?b(t[k+d+n])<<0:m<<0):(f|=m<<3,f|=m<<0),c<d?(f|=i>0?b(t[k+c])<<2:m<<2,f|=h<y?b(t[k+d+c])<<1:m<<1):(f|=m<<2,f|=m<<1),0===f||15===f)return null;switch(f){case 1:v=[n,i+.5];break;case 2:v=[n+.5,h];break;case 3:v=[n,i+.5];break;case 4:v=[c,i+.5];break;case 5:v=p?[n,i+.5]:[c,i+.5];break;case 6:v=[n+.5,h];break;case 7:v=[n,i+.5];break;case 8:case 9:v=[n+.5,i];break;case 10:v=g?[n+.5,i]:[n+.5,h];break;case 11:v=[n+.5,i];break;case 12:case 13:v=[c,i+.5];break;case 14:v=[n+.5,h];break;default:throw new Error("Invalid cell value")}do{switch(r[k+n]=e,f){case 1:v.push(n+.5,h),i=h,p=!1,g=!0;break;case 2:case 3:v.push(c,i+.5),n=c,p=!0,g=!1;break;case 4:v.push(n+.5,i),i=l,p=!1,g=!1;break;case 5:p?(v.push(n+.5,i),i=l,g=!1):(v.push(n+.5,h),i=h,g=!0),p=!1;break;case 6:case 7:v.push(n+.5,i),i=l,p=!1,g=!1;break;case 8:v.push(n,i+.5),n=u,p=!1,g=!1;break;case 9:v.push(n+.5,h),i=h,p=!1,g=!0;break;case 10:g?(v.push(c,i+.5),n=c,p=!0):(v.push(n,i+.5),n=u,p=!1),g=!1;break;case 11:v.push(c,i+.5),n=c,p=!0,g=!1;break;case 12:v.push(n,i+.5),n=u,p=!1,g=!1;break;case 13:v.push(n+.5,h),i=h,p=!1,g=!0;break;case 14:v.push(n,i+.5),n=u,p=!1,g=!1;break;default:throw new Error("Unhandled cell value: "+JSON.stringify({cellCase:f,x:n,y:i},null,4))}k=i*d,l=i-1,h=i+1,u=n-1,c=n+1,f=0,n>0?(f|=i>0?b(t[k+n])<<3:m<<3,f|=h<y?b(t[k+d+n])<<0:m<<0):(f|=m<<3,f|=m<<0),c<d?(f|=i>0?b(t[k+c])<<2:m<<2,f|=h<y?b(t[k+d+c])<<1:m<<1):(f|=m<<2,f|=m<<1)}while(n!==a||i!==o);return v}function l(e,t,r,n,i,a){var o=i-r,s=a-n,u=Math.sqrt(o*o+s*s);u>0&&(o/=u,s/=u);var c=e-r,l=t-n,h=o*c+s*l,f=c-h*o,v=l-h*s;return Math.sqrt(f*f+v*v)}function h(e,t){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];r&&e.push(e[0],e[1]);var n=[e[0],e[1]];return function e(t,r,n,i,a){for(var o=0,s=0,u=t[r],c=t[r+1],h=t[n],f=t[n+1],v=r+2;v<n;v+=2){var p=l(t[v],t[v+1],u,c,h,f);p>o&&(s=v,o=p)}o>i?(e(t,r,s,i,a),e(t,s,n,i,a)):a.push(h,f)}(e,0,e.length-2,t,n),r?n.slice(0,n.length-2):n}var f=1/1048576;function v(e,t,r,n){var i,a,o,s,u,c,l,h,v,p,g=e[2*t],d=e[2*t+1],y=e[2*r],b=e[2*r+1],m=e[2*n],k=e[2*n+1],w=Math.abs(d-b),M=Math.abs(b-k);if(w<f&&M<f)throw new Error("Eek! Coincident points!");return w<f?a=(s=-(m-y)/(k-b))*((i=(y+g)/2)-(c=(y+m)/2))+(h=(b+k)/2):M<f?a=(o=-(y-g)/(b-d))*((i=(m+y)/2)-(u=(g+y)/2))+(l=(d+b)/2):(i=((o=-(y-g)/(b-d))*(u=(g+y)/2)-(s=-(m-y)/(k-b))*(c=(y+m)/2)+(h=(b+k)/2)-(l=(d+b)/2))/(o-s),a=w>M?o*(i-u)+l:s*(i-c)+h),{i:t,j:r,k:n,x:i,y:a,r:(v=y-i)*v+(p=b-a)*p}}function p(e){var t,r,n,i,a,o;for(r=e.length;r;)for(i=e[--r],n=e[--r],t=r;t;)if(o=e[--t],n===(a=e[--t])&&i===o||n===o&&i===a){e.splice(r,2),e.splice(t,2);break}}var g,d={triangulate:function(e){var t,r,n,i,a,o,s,u,c,l,h,g,d=e.length/2;if(d<3)return[];for(e=e.slice(0),n=new Array(d),t=d;t--;)n[t]=t;for(n.sort(function(t,r){var n=e[2*r]-e[2*t];return 0!==n?n:t-r}),i=function(e){var t,r,n,i,a,o,s=Number.POSITIVE_INFINITY,u=Number.POSITIVE_INFINITY,c=Number.NEGATIVE_INFINITY,l=Number.NEGATIVE_INFINITY;for(t=e.length;t--;)e[2*t]<s&&(s=e[2*t]),e[2*t]>c&&(c=e[2*t]),e[2*t+1]<u&&(u=e[2*t+1]),e[2*t+1]>l&&(l=e[2*t+1]);return n=l-u,[(a=s+.5*(r=c-s))-20*(i=Math.max(r,n)),(o=u+.5*n)-i,a,o+20*i,a+20*i,o-i]}(e),a=[v(e=e.concat(i),d+0,d+1,d+2)],o=[],s=[],t=n.length;t--;s.length=0){for(g=n[t],r=a.length;r--;)(u=e[2*g]-a[r].x)>0&&u*u>a[r].r?(o.push(a[r]),a.splice(r,1)):u*u+(c=e[2*g+1]-a[r].y)*c-a[r].r>f||(s.push(a[r].i,a[r].j,a[r].j,a[r].k,a[r].k,a[r].i),a.splice(r,1));for(p(s),r=s.length;r;)h=s[--r],l=s[--r],a.push(v(e,l,h,g))}for(t=a.length;t--;)o.push(a[t]);for(a.length=0,t=o.length;t--;)o[t].i<d&&o[t].j<d&&o[t].k<d&&a.push(o[t].i,o[t].j,o[t].k);for(var y=0;y<a.length;y++)a[y]*=2;return a},contains:function(e,t,r,n,i,a,o){if(i<e[t]&&i<e[r]&&i<e[n]||i>e[t]&&i>e[r]&&i>e[n]||a<e[t+1]&&a<e[r+1]&&a<e[n+1]||a>e[t+1]&&a>e[r+1]&&a>e[n+1])o.isNull=!0;else{var s=e[r]-e[t],u=e[n]-e[t],c=e[r+1]-e[t+1],l=e[n+1]-e[t+1],h=s*l-u*c;if(0===h)return null;var f=(l*(i-e[t])-u*(a-e[t+1]))/h,v=(s*(a-e[t+1])-c*(i-e[t]))/h;f<0||v<0||f+v>1?o.isNull=!0:(o.u=f,o.v=v,o.isNull=!1)}}};function y(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function b(e,t){var r=Object.keys(e);return Object.getOwnPropertySymbols&&r.push.apply(r,Object.getOwnPropertySymbols(e)),t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r}function m(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?b(r,!0).forEach(function(t){k(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):b(r).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function k(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var w=2*Math.PI,M=1.4,x=20,z=5,T=.034,I=2e3;function N(e){return e<-1?-1:e>1?1:e}var O=.05,E=.07,A=.09,S=.5,D=1,j=2,P=3,_=4,C=5,F=6,U=7,L=8,q=9,R=10,Y=5,G=6,X=8,B=10,V=11,H=15,J=17;function K(e){if(!e)return 0;for(var t=0,r=1;r<e.length;r+=2)t+=e[r];return t}var W=[0,0,.5,1,1,-2,1,1,0];var Q=function(e){for(var t in e)if(e.hasOwnProperty(t)){var r=e[t];if(r)for(var n=K(r),i=1;i<r.length;i+=2)r[i]/=n}return e}((k(g={},D,[9,1]),k(g,j,[0,500,H,1,J,1,16,1]),k(g,P,[0,1e3,B,2,V,2,12,3,14,3,H,1,J,1,16,2]),k(g,_,[0,1e3,B,2,V,2,12,3,14,3,H,1,J,1,16,2]),k(g,C,[X,4,H,1,J,1,16,1]),k(g,F,[7,150,B,2,V,2,12,5,13,5,14,5,2,1,3,1,4,1,H,1,J,1,16,2]),k(g,U,[7,40,B,2,V,2,12,5,13,5,14,5,2,1,3,1,4,1,H,1,J,1,16,2]),k(g,L,[G,1]),g));function Z(e,t,r){var n=e.things,i=(e.size,e.sizeMask);if(0===n[t]){var a=Q[r];if(a){var o=function(e,t){if(t.length<4)return t[0];var r=e.random.next(),n=1;do{r-=t[n],n+=2}while(r>0&&n<t.length);return t[n-3]}(e,a);if(o)if(o===B||o===V){var s=t-2&i,u=t-1&i,c=t+1&i,l=t+2&i,h=t+3&i;n[t-3&i]!==X&&n[s]!==X&&n[u]!==X&&(n[t]=o,n[c]=X,n[l]=X,n[h]=X)}else if(o===H||o===J){var f=t+1&i;n[t-1&i]!==X&&(n[t]=o,n[f]=X)}else n[t]=o}}}var $=[0,0];function ee(e,t,r,n){var i,a=e.heightCoords(t,r),o=e.heightFn(t,r,a,$);if(n=N(n-.96*o+.2*$[1]),o<O)i=D;else if(o<E)i=j;else if(o<S){var s=a.nx,u=a.ny,c=a.nz,l=a.nw,h=o>A?e.noise4D(s*z,l*z,u*z,c*z):1,f=e.noise4D(s*x,l*x,u*x,c*x);i=h<0?f<0?F:U:f<0?P:_}else i=C;if(n<.4){if(i===D)return R;if(i===U||i===P||i===_||i===j)return q;if(i===F)return C}else if(n>.95&&(i===F||i===U||i===P||i===_))return j;return i}function te(e,t,r,n){for(var i=new le(e,t),a=i.tiles,o=0,s=e/20|0,u=w/2/e,c=0,l=0;l<e;l++){var h=Math.sin(c);c+=u;for(var f=0;f<e;f++){var v=ee(i,f,l,h);a[o]=v,Z(i,o,v),o++}r&&l%s==0&&r(n*l/e)}return i}var re=[0,-1,-1,0,1,0,0,1];function ne(e,t){for(var r=t.value,n=t.x,i=t.y,a=e.size,o=!1,s=0;s<re.length;s+=2){var u=t.x+re[s],c=t.y+re[s+1];if(u>0&&c>0&&u<a&&c<a){var l=e.heightFn(u,c);l>r&&(r=l,n=u,i=c,o=!0)}}return!!o&&{x:n,y:i,value:r,points:[]}}function ie(e){var t=function(e){for(var t=[],r=e.size,n=r*r/1e3,i=0;i<n;i++){var a=e.random.next()*r|0,o=e.random.next()*r|0,s=e.heightFn(a,o);s>O&&t.push({x:a,y:o,value:s,points:[],tile:0})}return t}(e),r=e.size,n=t.length,i=0,a=0;for(a=0;a<r/2&&i<n;a++)for(var o=i;o<n;o++){var s=ne(e,t[o]);if(s)t[o]=s;else{var u=t[i];t[i]=t[o],t[o]=u,i++}}return function(e,t){for(var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:8,n=[],i=0;i<t.length;i++){var a=t[i],o=e.random.nextInt(-r,r),s=e.random.nextInt(-r,r);a.x=a.x+o,a.y=a.y+s,e.heightFn(a.x,a.y)>S&&e.random.next()<.6&&n.push(m({},a,{points:[],x:a.x-r-s|0,y:a.y-r+o|0}))}return t.concat(n)}(e,function(e){for(var t=e.length,r=[],n=0;n<t;n++){for(var i=e[n],a=!0,o=t-1;o>n;o--){var s=e[o];if(i.x===s.x&&i.y===s.y){a=!1;break}}a&&r.push(i)}return r}(t))}function ae(e,t){for(var r=1/0,n=t.x,i=t.y,a=-1,o=-1,s=!1,u=e.size,c=0;c<re.length;c+=2){var l=t.x+re[c],h=t.y+re[c+1];if(l>0&&h>0&&l<u&&h<u){var f=e.read(l,h);if(f!==L){if(f===C){var v=e.heightCoords(l,h),p=v.nx,g=v.ny,d=v.nz,y=v.nw;f=e.noise4D(p*x,y*x,g*x,d*x)<0?P:_}var b=e.heightFn(l,h)-(f!==j&&f===t.tile?.001:0);b<r&&(r=b,n=l,i=h,a=f,o=c,s=!0)}}}if(s){var m=e.random.next();if(m<.25){var k=2*(o/2+(m<.125?-1:1)&3);t.x+=re[k],t.y+=re[k+1],t.points.push(t.x,t.y),t.x+=re[k],t.y+=re[k+1],t.value=1,t.tile=e.read(t.x,t.y)}else t.x=n,t.y=i,t.value=r,t.tile=a}else{var w=2*e.random.nextInt(0,3);t.x+=re[w],t.y+=re[w+1],t.tile=e.read(t.x,t.y)}}function oe(e){var t,r=ie(e),n=e.size,i=r.length,a=0,o=0;for(o=0;o<n&&a<i;o++)for(var s=a;s<i;s++){var c=r[s],l=c.x,h=c.y;c.points.push(l,h);var f=e.read(c.x,c.y);if(f!==D&&f!==q&&f!==R)ae(e,c);else{var v=r[a];r[a]=r[s],r[s]=v,a++}}for(var p=0;p<r.length;p++)for(var g=r[p].points,d=0;d<g.length;d+=2){var y=(t=d,0|Math.min(8,.008*t));u(e,g[d],g[d+1],y)}return r}function se(e,t){for(var r=function(e,t){t.sort(function(e,t){return e.points.length-t.points.length}),t.length;var r=function(e){var t=(e.length-1)/2;return t%1?e[0|t].points.length+e[1+(0|t)].points.length/2:e[0|t].points.length}(t);return t.filter(function(e){return e.points.length>2*r})}(0,t).filter(function(t,r){var n,i=t.points,a=i.length,o=a*T|0,s=i[a-2],u=i[a-1];for(n=a-4;n>0;n-=2){var c=i[n]-s,l=i[n+1]-u;if(Math.sqrt(c*c+l*l)>o)break}for(var h=function(e,t,r){for(var n,i,a=1/0,o=0;o<re.length;o+=2){for(var s=re[o],u=re[o+1],c=1,l=t+s,h=r+u;e.read(l,h)===L;)c++,l+=s,h+=u;c<a&&(a=c,n=l,i=h)}return{px:n,py:i}}(e,i[n],i[n+1]),f=h.px,v=h.py,p=o*o,g=0,d=-o;d<o;d++)for(var y=0|Math.sqrt(p-d*d),b=-y;b<y;b++)g+=W[e.read(f+b,v+d)];return t.centerX=f&e.sizeMask,t.centerY=v&e.sizeMask,t.radius=o,g>I}),n=0;n<r.length;n++)for(var i=r[n],a=i.centerX,o=i.centerY,s=i.radius,u=s*s,c=-s;c<=s;c++){var l=Math.round(Math.sqrt(u-c*c));e.putThing(a+l,o+c,Y),e.putThing(a-l,o+c,Y)}return r}var ue=2.5;function ce(e,t){var r=function(e,t,r,n,i){if(e.length!==t*r)throw new Error("array size does not match width*height: "+JSON.stringify({array:e.length,width:t,height:r}));for(var a=s()(),o=new Uint8Array(t*r),u=[],l={width:t,height:r,condition:n,outside:i},h=0;h<r;h++)for(var f=0;f<t;f++){var v=c(u.length+1,e,o,f,h,f,h,l);v&&v.length>6&&u.push(v)}return console.log("Marching squares done in "+(s()()-a)+"ms"),u}(e.things,e.size,e.size,function(e){return e>=X},!0);console.log("MARCHING-CUBE: polygons = ",r.length,", vertexes = ",r.reduce(function(e,t){return e+t.length},0));var n=r.map(function(e){return h(e,ue,!0)}).filter(function(e){return e.length>6});console.log("SIMPLIFIED: polygons = ",n.length,", vertexes = ",n.reduce(function(e,t){return e+t.length},0));var i=function(e){for(var t=[],r=0;r<e.length;r++)t=t.concat(e[r]);return t}(n),a=d.triangulate(i);console.log("DELAUNAY: triangles",a.length/3,", vertexes = ",a.length);var o=function(e,t,r){return r}(0,0,a);console.log("WALKABLE: triangles",o.length/3,", vertexes = ",o.length),e.vertices=i,e.polygons=n,e.triangles=o}var le=function(){function e(){var t=this,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:800,n=arguments.length>1?arguments[1]:void 0,o=arguments.length>2?arguments[2]:void 0,s=arguments.length>3?arguments[3]:void 0;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),Math.log(r)/Math.log(2)%1!=0)throw new Error("Size must be power of two: "+r);this.random=new a(n),this.noise=new i.a(function(){return t.random.next()}),this.size=r,this.sizeMask=r-1,this.fineMask=(r<<4)-1,this.factor=1/r,this.tiles=o||new Uint8Array(r*r),this.things=s||new Uint8Array(r*r)}var t,r,n;return t=e,n=[{key:"deserialize",value:function(t){var r=t.size,n=t.seed,i=t.things;return new e(r,n,t.tiles,i)}},{key:"generate",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:(new Date).getTime(),r=arguments.length>2?arguments[2]:void 0,n=s()(),i=te(e,t,r,.75),a=s()(),o=oe(i),u=s()();r&&r(.87);se(i,o);var c=s()();ce(i),r&&r(1);var l=s()();return console.log("Base in ".concat(a-n,"ms")),console.log("Rivers in ".concat(u-n,"ms")),console.log("Cities in ".concat(c-n,"ms")),console.log("Roads in ".concat(l-n,"ms")),i}}],(r=[{key:"read",value:function(e,t){return this.tiles[(t&this.sizeMask)*this.size+(e&this.sizeMask)]}},{key:"getThing",value:function(e,t){return this.things[(t&this.sizeMask)*this.size+(e&this.sizeMask)]}},{key:"write",value:function(e,t,r){this.tiles[(t&this.sizeMask)*this.size+(e&this.sizeMask)]=r}},{key:"putThing",value:function(e,t,r){this.things[(t&this.sizeMask)*this.size+(e&this.sizeMask)]=r}},{key:"heightFn",value:function(e,t,r){var n,i,a,o,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,u=e*this.factor,c=t*this.factor;r?(n=r.nx,i=r.ny,a=r.nz,o=r.nw):(n=Math.cos(u*w),i=Math.cos(c*w),a=Math.sin(u*w),o=Math.sin(c*w));var l=this.noise4D(.4*n,.4*i,.4*a,.4*o),h=this.noise4D(n*M,o*M,i*M,a*M);return s&&(s[0]=l,s[1]=h),N(l<0?-l*l:l*l)+.3*h}},{key:"heightCoords",value:function(e,t){var r=e*this.factor,n=t*this.factor;return{nx:Math.cos(r*w),ny:Math.cos(n*w),nz:Math.sin(r*w),nw:Math.sin(n*w)}}},{key:"render",value:function(e){for(var t=this.size,r=e.createImageData(t,t),n=r.data,i=0,a=0,o=0;o<t;o++)for(var s=0;s<t;s++){switch(this.tiles[i++]){case L:n[a++]=128,n[a++]=128,n[a++]=255,n[a++]=255;break;case D:n[a++]=0,n[a++]=32,n[a++]=128,n[a++]=255;break;case j:n[a++]=192,n[a++]=160,n[a++]=0,n[a++]=255;break;case P:n[a++]=0,n[a++]=128,n[a++]=0,n[a++]=255;break;case F:n[a++]=0,n[a++]=108,n[a++]=16,n[a++]=255;break;case U:n[a++]=0,n[a++]=64,n[a++]=32,n[a++]=255;break;case _:n[a++]=64,n[a++]=64,n[a++]=0,n[a++]=255;break;case C:n[a++]=100,n[a++]=100,n[a++]=100,n[a++]=255;break;case q:n[a++]=248,n[a++]=248,n[a++]=255,n[a++]=255;break;case R:n[a++]=220,n[a++]=220,n[a++]=255,n[a++]=255}}return r}},{key:"noise4D",value:function(e,t,r,n){return this.noise.noise4D(e,t,r,n)}},{key:"serialize",value:function(){return{_:"Map serialization",size:this.size,seed:this.random._seed,tiles:this.tiles,things:this.things}}}])&&y(t.prototype,r),n&&y(t,n),e}();onmessage=function(e){var t=e.data,r=t.type,n=t.ticket;if("GENERATE"===r){var i=e.data.seed;console.log("Generating world '"+i+"'");var a=le.generate(2048,i,function(e){return postMessage({type:"PROGRESS",percent:e,ticket:n})});postMessage({type:"MAPRESULT",ticket:n,payload:a.serialize()})}else postMessage({type:"ERROR_UNHANDLED",ticket:n})}}]);
//# sourceMappingURL=4473ae86e186768231ce.worker.js.map