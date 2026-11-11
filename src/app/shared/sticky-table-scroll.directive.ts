import { Directive, ElementRef, AfterViewInit, Input, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appStickyTable]'
})
export class StickyTableScrollDirective implements AfterViewInit, OnDestroy {
  @Input() stickyHeader: boolean = true;
  @Input() stickyCols: number = 0;
  @Input() stickyRightCols: number = 0;
  @Input() tableHeight: string = '500px'; // 👈 you can control height from template

  private scrollContainer!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const table: HTMLElement = this.el.nativeElement;

    // Wrap table in a scroll container
    this.scrollContainer = this.renderer.createElement('div');
    this.renderer.setStyle(this.scrollContainer, 'max-height', this.tableHeight);
    this.renderer.setStyle(this.scrollContainer, 'overflow-y', 'auto');
    this.renderer.setStyle(this.scrollContainer, 'overflow-x', 'auto');
    this.renderer.setStyle(this.scrollContainer, 'position', 'relative');

    const parent = table.parentNode;
    if (parent) {
      this.renderer.insertBefore(parent, this.scrollContainer, table);
      this.renderer.removeChild(parent, table);
      this.renderer.appendChild(this.scrollContainer, table);
    }

    // Call sticky logic
    this.applyStickyFeatures(table);
  }

  private applyStickyFeatures(table: HTMLElement) {
    if (this.stickyHeader) {
      const thead = table.querySelector('thead');
      if (thead) {
        this.renderer.setStyle(thead, 'position', 'sticky');
        this.renderer.setStyle(thead, 'top', '0');
        this.renderer.setStyle(thead, 'z-index', '10');
        this.renderer.setStyle(thead, 'background', '#fff');
      }
    }

    if (this.stickyCols > 0) {
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        for (let i = 0; i < this.stickyCols; i++) {
          const cell = cells[i] as HTMLElement;
          if (cell) {
            this.renderer.setStyle(cell, 'position', 'sticky');
            this.renderer.setStyle(cell, 'left', `${i * 150}px`); // adjust column width
            this.renderer.setStyle(cell, 'z-index', '9');
            this.renderer.setStyle(cell, 'background', '#fff');
          }
        }
      });
    }

    if (this.stickyRightCols > 0) {
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        for (let i = 0; i < this.stickyRightCols; i++) {
          const cell = cells[cells.length - 1 - i] as HTMLElement;
          if (cell) {
            this.renderer.setStyle(cell, 'position', 'sticky');
            this.renderer.setStyle(cell, 'right', `${i * 150}px`); // adjust column width
            this.renderer.setStyle(cell, 'z-index', '9');
            this.renderer.setStyle(cell, 'background', '#fff');
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.scrollContainer && this.el.nativeElement.parentNode === this.scrollContainer) {
      const parent = this.scrollContainer.parentNode;
      if (parent) {
        this.renderer.insertBefore(parent, this.el.nativeElement, this.scrollContainer);
        this.renderer.removeChild(parent, this.scrollContainer);
      }
    }
  }
}
