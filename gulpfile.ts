let gulp = require("gulp");
let ts = require("gulp-typescript");
let sourcemaps = require('gulp-sourcemaps');
let rename = require("gulp-rename");
let uglify = require("gulp-uglify");
let concat = require('gulp-concat');
let clean = require('gulp-clean');
let jsobfuscator = require('gulp-javascript-obfuscator');
let debug = require('gulp-debug');
let notify = require('gulp-notify');
let merge = require('merge2');
let through = require('through2');

let fs=require("fs");
let path=require("path");
let argv = require('yargs').argv;

/**
 * 框架ts配置
 */
const framworkTS = ts.createProject({
	module : "system",
	lib : [ "dom", "es5", "es2015.promise" ],
	target : "es5",
	experimentalDecorators : true,
	skipLibCheck : true,
	noImplicitAny : false,
    declaration : true,
	removeComments : true,
	outFile : "lcc-nes.js",
});

/**
 * 构建框架
 */
export function buildFramework(cb:Function) {
	if(fs.existsSync('framework')){
		console.log("buildFramework");
		let tsResult = gulp.src([ 'framework/**/*.ts' ])
			.pipe(sourcemaps.init())
			.pipe(framworkTS());
		return merge(
			tsResult.js
				/*
				.pipe(jsobfuscator({
					compact: true
				}))
				.pipe(uglify())
				*/
				.pipe(sourcemaps.write())
				.pipe(gulp.dest('assets/scripts')),
			tsResult.dts
				/*
				.pipe(rename((path)=>{
					path.basename = "lcc-" + path.basename; 
				}))
				*/
				.pipe(gulp.dest('./'))
			);
	}else{
		console.error("framework sources not found!");
		cb();
	}
}

/**
 * 测试
 * @param cb 
 */
export function test(cb:Function){
	return gulp.src([ '../../@types/**/*.ts', '../../assets/**/*.ts', '!../../assets/packs/**/*.ts' ])
		.pipe(debug({title: 'file:'}));
}

/**
 * 默认构建
 */
export default function build(cb:Function){
	console.log("please select a task:");
	console.log("	buildFramework");
	cb();
}
