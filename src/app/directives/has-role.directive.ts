import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({ selector: '[hasRole]' })
export class HasRoleDirective {
  private roles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {}

  @Input() set hasRole(role: string | string[]) {
    this.roles = Array.isArray(role) ? role : [role];
    this.updateView();
  }

  private updateView() {
    const hasAccess = this.roles.some((r) => this.auth.hasRole(r));
    this.viewContainer.clear();
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
