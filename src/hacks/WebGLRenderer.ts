declare module PIXI {
	interface BaseTexture {
		uid: number;
		_updateID: number;
	}

	interface BaseRenderTexture {
		uid: number;
	}
}

declare module PIXI.glCore {
	interface GLTexture {
		_updateID: number;
	}
}

module pixi_atlas {

	function bindTexture(texture: any,
	                     location?: number, forceLocation?: boolean): number {
		texture = texture || this.emptyTextures[location];
		texture = texture.baseTexture || texture;
		texture.touched = this.textureGC.count;

		if (!forceLocation) {
			// TODO - maybe look into adding boundIds.. save us the loop?
			for (let i = 0; i < this.boundTextures.length; i++) {
				if (this.boundTextures[i] === texture) {
					return i;
				}
			}

			if (location === undefined) {
				this._nextTextureLocation++;
				this._nextTextureLocation %= this.boundTextures.length;
				location = this.boundTextures.length - this._nextTextureLocation - 1;
			}
		}
		else {
			location = location || 0;
		}

		const gl = this.gl;
		const glTexture = texture._glTextures[this.CONTEXT_UID];

		if (!glTexture || glTexture._updateID < texture._updateID) {
			// this will also bind the texture..
			this.textureManager.updateTexture(texture, location);
		}
		else {
			// bind the current texture
			this.boundTextures[location] = texture;
			gl.activeTexture(gl.TEXTURE0 + location);
			gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
		}

		return location;
	}

	PIXI.WebGLRenderer.prototype.bindTexture = bindTexture;
}
