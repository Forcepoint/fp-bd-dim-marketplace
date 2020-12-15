import { CatalogModule } from '@/components/dataclasses/CatalogModule'

/** Class representing an module module */
export class Marketplace {
  public modules: CatalogModule[]

  constructor(modules: CatalogModule[]) {
    this.modules = modules
  }
}
