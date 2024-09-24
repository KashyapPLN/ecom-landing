import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Navbar, Nav, Offcanvas, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { AiOutlineMenu } from 'react-icons/ai';
import './landingpage.css';

export default function LandingPage() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    useEffect(() => {
          axios.get('https://fakestoreapi.com/products')
          .then(response => {
            setProducts(response.data);
          })
          .catch(error => {
            console.error('Error fetching the products:', error);
          });
      }, []);
      const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
      });
    
      const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
      };
    
  return (
    <Container className="my-4">
      <h4 className="text-center">ECommerce Store</h4>  

      {/* Category Filter */}
     <Navbar bg="dark" data-bs-theme="dark" className="mb-3">
        <Container>
          <Button className='all-items-btn' variant="text" onClick={() => setShowOffcanvas(true)}>
            <AiOutlineMenu /> All Items
          </Button>
          <Nav className="ml-auto">
            <Nav.Item>
              <Nav.Link onClick={() => setCategory('all')} active={category === 'all'}>All</Nav.Link>
            </Nav.Item>
            {categories.map((cat, idx) => (
              <Nav.Item key={idx}>
                <Nav.Link onClick={() => setCategory(cat)} active={category === cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Container>
      </Navbar>
          {/* Offcanvas for categories */}
          <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Categories</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link onClick={() => { setCategory('all'); setShowOffcanvas(false); }}>All Items</Nav.Link>
            {categories.map((cat, idx) => (
              <Nav.Link key={idx} onClick={() => { setCategory(cat); setShowOffcanvas(false); }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

       {/* Search Bar */}
       <Row>
        <Col md={4} sm={12}>
        <Form.Control
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
        </Col>
      </Row>

      {/* Product Grid */}
      <Row>
        {filteredProducts.map(product => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src={product.image} alt={product.title} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{product.title}</Tooltip>}
                >
                  <p className="product-title">{product.title}</p>
                </OverlayTrigger>
                <Card.Text>${product.price.toFixed(2)}</Card.Text>
                <Button variant="outline-secondary" onClick={() => handleProductClick(product)}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Product Modal */}
      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{display:'flex',justifyContent:'center'}}>
          <img src={selectedProduct?.image} alt={selectedProduct?.title} style={{height:'50vh'}} className="img-fluid mb-3" />
          </div>
          <p><strong>Description:</strong> {selectedProduct?.description}</p>
          <p><strong>Price:</strong> ${selectedProduct?.price.toFixed(2)}</p>
          <p><strong>Available Quantity:</strong> {selectedProduct?.rating?.count}</p>
        </Modal.Body>
      </Modal>
      {filteredProducts.length=== 0&& <div>
        <p className='mt-4' style={{textAlign:'center'}}>No products found</p>
        </div>}
    </Container>
  )
}
