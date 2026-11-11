import { Directive, ElementRef, AfterViewInit, Input, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appStickyTable]'
})
export class StickyTableDirective implements AfterViewInit, OnDestroy {
  @Input() stickyHeader: boolean = true;
  @Input() stickyCols: number = 0;
  @Input() stickyRightCols: number = 0;

  private resizeObserver!: ResizeObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.applySticky();

    this.resizeObserver = new ResizeObserver(() => {
      this.resetSticky();
      this.applySticky();
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private resetSticky() {
    const table = this.el.nativeElement as HTMLTableElement;
    const cells = table.querySelectorAll('th, td');

    cells.forEach(cell => {
      const htmlCell = cell as HTMLElement;
      this.renderer.removeStyle(htmlCell, 'position');
      this.renderer.removeStyle(htmlCell, 'left');
      this.renderer.removeStyle(htmlCell, 'right');
      this.renderer.removeStyle(htmlCell, 'z-index');
      this.renderer.removeStyle(htmlCell, 'background');
    });
  }

  private applySticky() {
    const table = this.el.nativeElement as HTMLTableElement;

    // Sticky header
    if (this.stickyHeader) {
      const thead = table.querySelector('thead');
      if (thead) {
        this.renderer.setStyle(thead, 'position', 'sticky');
        this.renderer.setStyle(thead, 'top', '0');
        this.renderer.setStyle(thead, 'z-index', '5');
        this.renderer.setStyle(thead, 'background', '#f8f9fa');
      }
    }

    const rows = table.querySelectorAll('tr');

    // Sticky left columns
    if (this.stickyCols > 0) {
      rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        let leftOffset = 0;

        for (let i = 0; i < this.stickyCols && i < cells.length; i++) {
          const cell = cells[i] as HTMLElement;
          this.renderer.setStyle(cell, 'position', 'sticky');
          this.renderer.setStyle(cell, 'left', `${leftOffset}px`);
          this.renderer.setStyle(cell, 'z-index', '4');
          if (cell.tagName === 'TD') {
            this.renderer.setStyle(cell, 'background', '#fff'); // only body cells
          }
          if (cell.tagName === 'TH') {
            this.renderer.setStyle(cell, 'background', '#f3f6f9'); // Bootstrap header gray
          } else {
            this.renderer.setStyle(cell, 'background', '#fff');   // white body
          }
          this.renderer.setStyle(cell, 'box-shadow', '2px 0 5px 2px rgba(0,0,0,0.15)');
          leftOffset += cell.offsetWidth;
        }
      });
    }

    // Sticky right columns
    if (this.stickyRightCols > 0) {
      rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        let rightOffset = 0;
        for (let i = 0; i < this.stickyRightCols && i < cells.length; i++) {
          const cell = cells[cells.length - 1 - i] as HTMLElement;
          this.renderer.setStyle(cell, 'position', 'sticky');
          this.renderer.setStyle(cell, 'right', `${rightOffset}px`);
          this.renderer.setStyle(cell, 'z-index', cell.tagName === 'TH' ? '6' : '4');
          if (cell.tagName === 'TD') {
            this.renderer.setStyle(cell, 'background', '#fff'); // only body cells
          }
          // if (cell.tagName === 'TH') {
          //   this.renderer.setStyle(cell, 'background', '#f3f6f9');
          // } else {
          //   this.renderer.setStyle(cell, 'background', '#fff');
          // }
          // Subtle shadow on the left edge of sticky col
          // this.renderer.setStyle(cell, 'box-shadow', '-2px 0 5px -2px rgba(0,0,0,0.15)');
          rightOffset += cell.offsetWidth;
        }
      });
    }
  }
}
