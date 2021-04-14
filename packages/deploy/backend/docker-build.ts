import {Construct} from '@aws-cdk/core';
import {DockerImageAsset} from '@aws-cdk/aws-ecr-assets';
import * as path from 'path';
import {exec} from 'child_process';

interface DockerBuildProps {
  imagePath: string;
}

export class DockerBuild {
  public readonly image: DockerImageAsset;

  constructor(scope: Construct, id: string, props: DockerBuildProps) {
    this.image = new DockerImageAsset(scope, `${id}NodeJsApi`, {
      directory: props.imagePath,
    });
  }
}
